import { AssetOptimizerRuleArgument } from '../types';
import fs from 'fs/promises';
import path from 'path';
import svgo from 'svgo';

export async function svgCallback({ relativePath, inputCwd, outputCwd }: AssetOptimizerRuleArgument) {
	const srcPath = path.join(inputCwd, relativePath);
	const outputPath = path.join(outputCwd, relativePath);

	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
	});

	const data = await fs.readFile(srcPath);
	const { data: buffer } = svgo.optimize(data.toString());
	await fs.writeFile(outputPath, buffer);
}
