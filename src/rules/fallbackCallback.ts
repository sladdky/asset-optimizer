import fs from 'fs/promises'
import path from 'path'
import { AssetOptimizerRuleArgument } from '../types'

export async function fallbackCallback({ relativePath, cwd, outputCwd }: AssetOptimizerRuleArgument) {
	const srcPath = path.join(cwd, relativePath)
	const outputPath = path.join(outputCwd, relativePath)

	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
	})
	await fs.copyFile(srcPath, outputPath)
}
