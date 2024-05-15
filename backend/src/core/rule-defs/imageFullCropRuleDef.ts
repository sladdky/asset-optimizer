import sharp, { FitEnum } from 'sharp';
import { AssetOptimizerRuleDef, OptimizationError } from '../types';
import { AssetOptimizerOptimizationMeta } from '../types';
import { array, string, object, number } from 'yup';


const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'imageFullCrop',
	dataComponent: 'ImageFullCrop',
	ext: 'jpg|jpeg|png|tiff',
	processData(data) {
		const schema = object({
			size: string().default(''),
			strategy: string().oneOf(['exact', 'fit', 'extract']).default('exact'),
			extract: object({
				width: number().default(19999),
				height: number().default(19999),
				top: number().default(0),
				left: number().default(0),
			})
				.when('strategy', (strategy, schema) => {
					if ((strategy as unknown as string) === 'extract') {
						return schema.required();
					}
					return schema;
				})
				.default(undefined),
			variants: array(string().default('')).default([]),
		});

		return schema.cast(data);
	},
	async optimize({ inputPath, createOptMeta: createOptMeta, data }) {
		const optMetas: AssetOptimizerOptimizationMeta[] = [];
		try {
			const { size: rawSize, strategy, extract, variants: rawVariants } = data;

			const sharpOrigFile = sharp(inputPath);
			const getSizeFromOrigFile = async () => {
				const metadata = await sharpOrigFile.metadata();
				return {
					width: metadata.width ?? 0,
					height: metadata.height ?? 0,
				};
			};

			const size = parseSize(rawSize) || (await getSizeFromOrigFile());
			if (strategy === 'extract' && extract) {
				await sharpOrigFile.extract(extract);
				await sharpOrigFile.toBuffer({ resolveWithObject: true });
			}

			const STRATEGIES: Record<string, keyof FitEnum> = {
				crop: 'cover',
				fit: 'inside',
				extract: 'cover',
			};

			const variants = rawVariants.map((rawVariant) => parseVariant(rawVariant, size));
			const promises = variants.map(async ({ width, height, postfix }) => {
				if (!width && !height) {
					console.log('Skip, cannot resize, invalid width or height');
					//skip resize, width or height = 0
					return;
				}
				const optMeta = createOptMeta({
					name: (name) => `${name}${postfix}`,
					ext: (ext) => ext.toLowerCase(),
				});

				const sharpFile = sharpOrigFile.clone();

				await sharpFile.resize({ width, height, fit: STRATEGIES[strategy] });
				await sharpFile.toFile(optMeta.tempPath);
				optMetas.push(optMeta);
			});

			await Promise.all(promises);

		} catch (error) {
			if (error instanceof Error) {
				throw new OptimizationError(error.message);
			}
			throw error;
		}

		return {
			optimizations: optMetas,
		};
	},
};

function parseSize(strInput: string) {
	if (!strInput) {
		return null;
	}

	const [rawWidth = '99999', rawHeight = '99999'] = strInput.split('x');

	return {
		width: parseInt(rawWidth),
		height: parseInt(rawHeight),
	};
}

function parseVariant(
	strInput: string,
	size: {
		width: number;
		height: number;
	}
) {
	let postfix = '';
	let width, height;

	if (strInput.endsWith('w')) {
		width = parseInt(strInput.split('w')[0]);
		height = width * (size.height / size.width);
		postfix = `-${width}w`;
	} else if (strInput.endsWith('h')) {
		height = parseInt(strInput.split('h')[0]);
		width = height * (size.width / size.height);
		postfix = `-${height}h`;
	} else if (strInput.endsWith('x')) {
		const modifier = parseFloat(strInput.split('x')[0]);
		width = Math.ceil(modifier * size.width);
		height = Math.ceil(modifier * size.height);
		postfix = modifier !== 1 ? `@${modifier.toString().replace('.', '_')}x` : ``;
	} else {
		const [rawWidth = '0', rawHeight = '0'] = strInput.split('x');
		width = parseInt(rawWidth);
		height = parseInt(rawHeight);
	}

	return {
		width,
		height,
		postfix,
	};
}

export default ruleDef;
