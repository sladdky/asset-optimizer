import sharp from 'sharp';
import { AssetOptimizerRuleDef, OptimizationError } from '../types';

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'imageAuto',
	ext: 'jpg|jpeg|png|tiff',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const optMeta = createOptMeta({
			ext: (ext) => ext.toLowerCase(),
		});
		try {

			const sharpedFile = sharp(inputPath, { failOnError: false }).rotate();

			await new Promise<void>((resolve, reject) => {
				sharpedFile.toFile(optMeta.tempPath, (error) => {
					if (error) {
						reject(new OptimizationError(error.message));
					}
					resolve();
				});
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new OptimizationError(error.message);
			}
			throw error;
		}

		return {
			optimizations: [optMeta],
		};
	},
};

export default ruleDef;
