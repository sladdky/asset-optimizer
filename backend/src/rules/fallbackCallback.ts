import fs from 'fs/promises';
import path from 'path';
import { AssetOptimizerRuleArgument } from '../_shared/types';

export async function fallbackCallback({ relativePath, inputCwd, outputCwd }: AssetOptimizerRuleArgument) {
	const srcPath = path.join(inputCwd, relativePath);
	const outputPath = path.join(outputCwd, relativePath);

	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
	});
	await fs.copyFile(srcPath, outputPath);
}
