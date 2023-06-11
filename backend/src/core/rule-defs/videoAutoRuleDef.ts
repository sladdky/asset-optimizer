import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { AssetOptimizerRuleDef } from '../types';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'videoAuto',
	ext: 'mov|mp4',
	processData() {
		return {};
	},
	async optimize({ inputPath, createOptMeta: createOptMeta }) {
		const optMeta = createOptMeta();
		await new Promise<void>((resolve) => {
			ffmpeg(inputPath)
				.on('end', () => {
					resolve();
				})
				.audioBitrate(100)
				.videoBitrate(200)
				.output(optMeta.tempPath)
				.run();
		});

		return {
			optimizations: [optMeta],
		};
	},
};

export default ruleDef;
