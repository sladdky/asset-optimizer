import fs from 'fs';
import { extname } from 'path';

export function getPreviewImage(filename: string) {
	let base64 = '';
	const ext = extname(filename);

	if (['.png', '.jpg'].includes(ext)) {
		const exts: Record<string, string> = {
			'.svg': 'svg+xml',
			'.jpg': 'jpg',
			'.png': 'png',
		};

		try {
			base64 = `data:image/${exts[extname(filename)]};base64,${fs.readFileSync(filename, { encoding: 'base64' })}`;
		} catch (err: any) {
			if (err.code === 'ENOENT' || err.code === 'EISDIR') {
				// file not found
			} else {
				throw err;
			}
		}
	}

	//@todo other file extensions + resize and cache if the preview file is too big

	return base64;
}
