import { AssetOptimizerFileMap } from '../types';
import fs from 'fs';
import path from 'path';
import { getAoFile } from './getAoFile';

type Options = {
	cwd: string;
	ignoredPaths?: string[];
};

export function getAoFiles(
	currPath: string,
	options: Options = {
		cwd: '',
	}
): AssetOptimizerFileMap {
	let structure: AssetOptimizerFileMap = {};

	const files = fs.readdirSync(path.join(options.cwd, currPath));
	files.forEach((file: string) => {
		const relativePath = path.join(currPath, file);

		if (options.ignoredPaths && options.ignoredPaths.includes(relativePath)) {
			return;
		}

		structure[relativePath] = getAoFile({
			cwd: options.cwd,
			relativePath,
		});

		if (structure[relativePath].isDir) {
			structure = {
				...structure,
				...getAoFiles(relativePath, options),
			};
		}
	});

	return structure;
}
