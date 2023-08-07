import fs from 'fs';
import path from 'path';
import { AssetOptimizerFile } from '../types';

type Props = {
	cwd: string;
	relativePath: string;
};

export function getAoFile({ cwd, relativePath }: Props): Omit<AssetOptimizerFile, 'id'> {
	const fullPath = path.join(cwd, relativePath);
	const lstat = fs.lstatSync(fullPath);
	return {
		ext: path.extname(relativePath)?.split('.')[1].toLowerCase(),
		relativePath,
		modified: lstat.mtime.getTime(),
		isDir: lstat.isDirectory(),
	};
}
