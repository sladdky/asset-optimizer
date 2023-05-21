import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { AssetOptimizerRuleDefCallbackMeta, AssetOptimizerRuleProps } from '../types';

export async function imageCallback({ relativePath, inputCwd, outputCwd }: AssetOptimizerRuleProps): Promise<AssetOptimizerRuleDefCallbackMeta> {
	const { name, ext } = path.parse(relativePath);
	const outputDir = path.dirname(path.join(outputCwd, relativePath));
	const srcPath = path.join(inputCwd, relativePath);
	const sharpedFile = sharp(srcPath);

	await fs.mkdir(outputDir, {
		recursive: true,
	});

	const basename = `${name}${ext.toLowerCase()}`;
	const buffer = await sharpedFile.toBuffer();
	await fs.writeFile(path.join(outputDir, basename), buffer);

	return {
		optimizations: [{ relativePath }],
	};
}
