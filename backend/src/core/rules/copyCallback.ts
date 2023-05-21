import fs from 'fs/promises';
import path from 'path';
import { AssetOptimizerRuleDefCallbackMeta, AssetOptimizerRuleProps } from '../types';

export async function copyCallback({ relativePath, inputCwd, outputCwd }: AssetOptimizerRuleProps): Promise<AssetOptimizerRuleDefCallbackMeta> {
	const srcPath = path.join(inputCwd, relativePath);
	const outputPath = path.join(outputCwd, relativePath);

	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
	});
	await fs.copyFile(srcPath, outputPath);

	return {
		optimizations: [{ relativePath }],
	};
}
