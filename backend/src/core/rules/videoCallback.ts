import fs from 'fs/promises';
import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { AssetOptimizerRuleDefCallbackMeta, AssetOptimizerRuleProps } from '../types';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function videoCallback({
	relativePath,
	inputCwd,
	outputCwd,
}: AssetOptimizerRuleProps<string>): Promise<AssetOptimizerRuleDefCallbackMeta> {
	const srcPath = path.join(inputCwd, relativePath);
	const outputPath = path.join(outputCwd, relativePath);

	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
	});

	await new Promise<void>((resolve) => {
		ffmpeg(srcPath)
			.on('end', () => {
				resolve();
			})
			.output(outputPath)
			.run();
	});

	return {
		optimizations: [{ relativePath }],
	};
}
