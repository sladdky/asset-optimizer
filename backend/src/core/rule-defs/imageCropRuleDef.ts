import sharp from 'sharp'
import { AssetOptimizerRuleDef, OptimizationError } from '../types'
import { AssetOptimizerOptimizationMeta } from '../types'
import { string, object } from 'yup'
import { parseSize } from '../utils/parseSize'
import { calculateTransformInfo } from '../utils/calculateTransformInfo'
import { getImageMeta } from '../utils/getImageMeta'

const ruleDef: AssetOptimizerRuleDef = {
	ruleName: 'imageCrop',
	dataComponent: 'ImageCrop',
	ext: 'jpg|jpeg|png|tiff',
	processData(data) {
		const schema = object({
			size: string().default(''),
			strategy: string().oneOf(['exact', 'fit']).default('exact'),
		})

		return schema.cast(data)
	},
	async optimize({ inputPath, createOptMeta: createOptMeta, data }) {
		const optMetas: AssetOptimizerOptimizationMeta[] = []
		try {
			const { size: rawSize, strategy } = data

			const meta = await getImageMeta(inputPath)
			const desiredSize = parseSize(rawSize)

			const transInfo = calculateTransformInfo({
				meta,
				desiredSize,
				strategy,
				isRotationIncluded: true,
				isShrinkOnly: false
			})

			const optMeta = createOptMeta({
				name: (name) => `${name}-${strategy}-${rawSize.toLowerCase()}`,
				ext: (ext) => ext.toLowerCase(),
			})

			const sharpFile = sharp(inputPath, {
				failOn: 'truncated'
			})

			sharpFile.rotate() //apply meta rotation

			if (transInfo.extract) {
				sharpFile.extract(transInfo.extract)
			}

			if (transInfo.size) {
				sharpFile.resize(transInfo.size)
			}

			await sharpFile.toFile(optMeta.tempPath)

			optMetas.push(optMeta)
		} catch (error) {
			if (error instanceof Error) {
				throw new OptimizationError(error.message)
			}
			throw error
		}

		return {
			optimizations: optMetas,
		}
	},
}

export default ruleDef
