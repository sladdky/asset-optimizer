import fs from 'fs/promises';
import svgo from 'svgo';
import { AssetOptimizerRuleDef } from '../types';

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'svgAuto',
	ext: 'svg',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const data = await fs.readFile(inputPath);
		const { data: buffer } = svgo.optimize(data.toString());

		const optMeta = createOptMeta();
		await fs.writeFile(optMeta.tempPath, buffer);

		return {
			optimizations: [optMeta],
		};
	},
};

export default ruleDef;
