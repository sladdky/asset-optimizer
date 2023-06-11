import sharp from 'sharp';
import { AssetOptimizerRuleDef } from '../types';

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'imageAuto',
	ext: 'jpg|jpeg|png|tiff',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const sharpedFile = sharp(inputPath);

		const optMeta = createOptMeta({
			ext: (ext) => ext.toLowerCase(),
		});

		await new Promise<void>((resolve, reject) => {
			sharpedFile.toFile(optMeta.tempPath, (error) => {
				if (error) {
					reject(error);
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
