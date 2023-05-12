import { AssetOptimizerStructure } from '../_shared/types';
import fs from 'fs';
import path from 'path';
import { getFile } from './getFile';

type Options = {
	cwd: string;
	ignoredPaths?: string[];
};

export function getFiles(
	currPath: string,
	options: Options = {
		cwd: '',
	}
): AssetOptimizerStructure {
	let structure: AssetOptimizerStructure = {};

	const files = fs.readdirSync(path.join(options.cwd, currPath));
	files.forEach((file: string) => {
		const relativePath = path.join(currPath, file);
		const fullPath = path.join(options.cwd, relativePath);

		if (options.ignoredPaths && options.ignoredPaths.includes(relativePath)) {
			return;
		}

		structure[relativePath] = getFile(fullPath);

		if (structure[relativePath].isDir) {
			structure = {
				...structure,
				...getFiles(relativePath, options),
			};
		}
	});

	return structure;
}
