import path from 'path';
import fs from 'fs';
import { AssetOptimizerCreateOptMetaProps, AssetOptimizerRule } from '../types';
import { nanoid } from 'nanoid';

type Props = {
	tempCwd: string;
};

//optimizing file
export function createOptMetaComposition({ tempCwd }: Props) {
	const tempDir = path.join(tempCwd, '/.optimized/');

	fs.mkdirSync(tempDir, {
		recursive: true,
	});

	return (rule: AssetOptimizerRule) =>
		({ dir: dirFnc, name: nameFnc, ext: extFnc }: AssetOptimizerCreateOptMetaProps = {}) => {
			let { name, ext } = path.parse(rule.relativePath);
			let dir = path.dirname(rule.relativePath);
			dir = dirFnc?.(dir) ?? dir;
			name = nameFnc?.(name) ?? name;
			ext = extFnc?.(ext) ?? ext;

			const uid = nanoid();

			return {
				tempPath: path.join(tempDir, `${uid}${ext}`),
				relativePath: path.join(dir, `${name}${ext}`),
			};
		};
}
