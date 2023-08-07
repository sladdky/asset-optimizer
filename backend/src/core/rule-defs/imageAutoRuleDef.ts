import sharp from 'sharp';
import { AssetOptimizerRuleDef, OptimizationError } from '../types';

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'imageAuto',
	ext: 'jpg|jpeg|png|tiff',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const sharpedFile = sharp(inputPath, { failOnError: false });

		const optMeta = createOptMeta({
			ext: (ext) => ext.toLowerCase(),
		});

		await new Promise<void>((resolve, reject) => {
			sharpedFile.toFile(optMeta.tempPath, (error) => {
				if (error) {
					reject(new OptimizationError(error.message));
				}
				resolve();
			});
		});

		return {
			optimizations: [optMeta],
		};
	},
};

export default ruleDef;
