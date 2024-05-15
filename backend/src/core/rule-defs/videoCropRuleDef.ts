import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import { AssetOptimizerOptimizationMeta, AssetOptimizerRuleDef, OptimizationError } from '../types'
import { string, object, number } from 'yup'
import { parseSize } from '../utils/parseSize'
import { getVideoMeta } from '../utils/getVideoMeta'
import { calculateTransformInfo } from '../utils/calculateTransformInfo'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'videoCrop',
	dataComponent: 'VideoCrop',
	ext: 'mov|mp4',
	processData(data) {
		const schema = object({
			size: string().default(''),
			fps: number().transform((value) => (isNaN(value) ? -1 : value)).default(-1),
			strategy: string().oneOf(['exact', 'fit']).default('exact'),
		})

		return schema.cast(data)
	},
	async optimize({ inputPath, createOptMeta: createOptMeta, data }) {
		const optMetas: AssetOptimizerOptimizationMeta[] = []

		try {
			const { size: rawSize, strategy } = data
			const desiredSize = parseSize(data.size)

			const meta = await getVideoMeta(inputPath)

			const transInfo = calculateTransformInfo({
				meta,
				desiredSize,
				strategy,
				isRotationIncluded: true
			})

			const optMeta = createOptMeta({
				name: (name) => `${name}-${strategy}-${rawSize.toLowerCase()}`,
				ext: (ext) => ext.toLowerCase(),
			})

			await new Promise<void>((resolve, reject) => {
				ffmpeg(inputPath)
					.on('end', () => {
						resolve()
					})
					.on('error', (error) => {
						reject(new Error(`Error while ffmpeg conversion. ${error.message}`))
					})
					.videoFilter([
						transInfo.extract ? `crop=${transInfo.extract.width}:${transInfo.extract.height}:${transInfo.extract.top}:${transInfo.extract.left}` : ``,
						transInfo.size ? `scale=${transInfo.size.width}:${transInfo.size.height}` : ``
					])
					.audioBitrate(240)
					.videoBitrate(12000) //2k - 18000, fhd - 6000 (2000-4000 pouzitelny, ale uz je videt rozpixelovani)
					.FPSOutput(meta.fps)
					.output(optMeta.tempPath)
					.run()
			})

			optMetas.push(optMeta)
		} catch (error) {
			if (error instanceof Error) {
				throw new OptimizationError(error.message)
			}
		}

		return {
			optimizations: optMetas,
		}
	},
}

export default ruleDef

// type VideoProps = {
// 	fps: number
// 	width: number
// 	height: number
// }

// type VideoLimits = {
// 	fps?: number
// 	width?: number
// 	height?: number
// }


// function getLimitedVideoProps(inputPath: string, limits: VideoLimits = {}): Promise<VideoProps> {
// 	return new Promise<VideoProps>((resolve, reject) => {
// 		ffmpeg.ffprobe(inputPath, (error, data) => {
// 			if (error) {
// 				reject(error)
// 			}
// 			const MAX_WIDTH = limits.width ?? 99999
// 			const MAX_HEIGHT = limits.height ?? 99999
// 			const MAX_ASPECTRATIO = MAX_WIDTH / MAX_HEIGHT
// 			const MAX_FPS = limits.fps ?? 999999

// 			const rotation = data.streams[0].rotation ?? '0'
// 			const is90DegRotated = (rotation === '-90' || rotation === '90')
// 			const origWidth = (is90DegRotated ? data.streams[0].height : data.streams[0].width) ?? 1
// 			const origHeight = (is90DegRotated ? data.streams[0].width : data.streams[0].height) ?? 1
// 			const origFps = parseInt(data.streams[0].r_frame_rate ?? '1')
// 			const origAspectRatio = origWidth / origHeight

// 			const fps = Math.min(origFps, MAX_FPS)
// 			let height = 0
// 			let width = 0

// 			if (origAspectRatio >= MAX_ASPECTRATIO) {
// 				width = Math.min(MAX_WIDTH, origWidth)
// 				height = width / origAspectRatio
// 			} else {
// 				height = Math.min(MAX_HEIGHT, origHeight)
// 				width = height * origAspectRatio
// 			}

// 			resolve({
// 				width,
// 				height,
// 				fps
// 			})
// 		})
// 	})
// }