import fs from 'fs';
import { AssetOptimizerFile } from '../../_shared/types';

export function getFile(fullPath: string): AssetOptimizerFile {
	const lstat = fs.lstatSync(fullPath);
	return {
		modified: lstat.mtime.getTime(),
		isDir: lstat.isDirectory(),
	};
}
