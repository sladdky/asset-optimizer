import { AssetOptimizerStructure } from '../types'
import fs from 'fs'
import path from 'path'
import { getFile } from './getFile'

export function getFiles(
	currPath: string,
	options = {
		cwd: '',
	}
): AssetOptimizerStructure {
	let structure: AssetOptimizerStructure = {}

	const files = fs.readdirSync(path.join(options.cwd, currPath))
	files.forEach((file: string) => {
		const relativePath = path.join(currPath, file)
		const fullPath = path.join(options.cwd, relativePath)

		structure[relativePath] = getFile(fullPath)

		if (structure[relativePath].isDir) {
			structure = {
				...structure,
				...getFiles(relativePath, options),
			}
		}
	})

	return structure
}
