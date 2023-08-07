import fs from 'fs/promises';
import svgo from 'svgo';
import { AssetOptimizerRuleDef, OptimizationError } from '../types';

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'svgAuto',
	ext: 'svg',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const data = await fs.readFile(inputPath);
		const optMeta = createOptMeta();

		try {
			const { data: buffer } = svgo.optimize(data.toString());
			await fs.writeFile(optMeta.tempPath, buffer);
		} catch (error) {
			if (error instanceof Error && error.name === 'SvgoParserError') {
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
