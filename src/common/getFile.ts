import fs from 'fs'
import { AssetOptimizerFile } from '../types'

export function getFile(fullPath: string): AssetOptimizerFile {
	const lstat = fs.lstatSync(fullPath)
	return {
		modified: lstat.mtime.getTime(),
		isDir: lstat.isDirectory(),
	}
}
