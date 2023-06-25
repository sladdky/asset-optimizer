import fs from 'fs';
import { extname } from 'path';

export function getPreviewImage(path: string) {
	let base64 = '';

	try {
		base64 = fs.readFileSync(path, { encoding: 'base64' });
	} catch (err: any) {
		if (err.code === 'ENOENT' || err.code === 'EISDIR') {
			// file not found
		} else {
			throw err;
		}
	}

	const exts: Record<string, string> = {
		'.svg': 'svg+xml',
		'.jpg': 'jpg',
	};

	//@todo other file extensions + resize and cache if the preview file is too big

	return `data:image/${exts[extname(path)]};base64,${base64}`;
}
