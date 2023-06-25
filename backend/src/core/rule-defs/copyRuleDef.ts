import fs from 'fs/promises';
import { AssetOptimizerRuleDef } from '../types';

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'copy',
	ext: '',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const optMeta = createOptMeta();
		await fs.copyFile(inputPath, optMeta.tempPath);

		return {
			optimizations: [optMeta],
		};
	},
};

export default ruleDef;
