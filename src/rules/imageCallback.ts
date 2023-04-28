import { AssetOptimizerRuleArgument } from '../types';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

export async function imageCallback({ relativePath, inputCwd, outputCwd, additionalData }: AssetOptimizerRuleArgument) {
	const { name, ext } = path.parse(relativePath);
	const outputDir = path.dirname(path.join(outputCwd, relativePath));
	const srcPath = path.join(inputCwd, relativePath);
	const sharpedFile = sharp(srcPath);

	await fs.mkdir(outputDir, {
		recursive: true,
	});

	let widths: number[] = additionalData?.widths ?? [];
	//0 = original without resize
	widths = [0, ...widths];

	const promises = widths.map(async (width) => {
		const basename = `${name}${width ? `@${width}` : ``}${ext.toLowerCase()}`;

		const _sharpedFile = sharpedFile.clone();
		if (width) {
			await _sharpedFile.resize({ width });
		}

		const buffer = await _sharpedFile.toBuffer();
		fs.writeFile(path.join(outputDir, basename), buffer);
	});

	await Promise.all(promises);
}
