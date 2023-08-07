import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { AssetOptimizerRuleDef, OptimizationError } from '../types';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'videoAuto',
	ext: 'mov|mp4',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const optMeta = createOptMeta();
		try {
			await new Promise<void>((resolve, reject) => {
				ffmpeg(inputPath)
					.on('end', () => {
						resolve();
					})
					.on('error', (error) => {
						reject(new Error('Error while ffmpeg conversion'));
					})
					.audioBitrate(100)
					.videoBitrate(200)
					.output(optMeta.tempPath)
					.run();
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new OptimizationError(error.message);
			}
		}

		return {
			optimizations: [optMeta],
		};
	},
};

export default ruleDef;
