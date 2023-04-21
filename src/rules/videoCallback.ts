import { AssetOptimizerRuleArgument } from '../types'
import fs from 'fs/promises'
import path from 'path'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function videoCallback({ relativePath, cwd, outputCwd }: AssetOptimizerRuleArgument) {
	const srcPath = path.join(cwd, relativePath)
	const outputPath = path.join(outputCwd, relativePath)

	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
	})

	ffmpeg(srcPath)
		.output(outputPath)
		.run()
}
