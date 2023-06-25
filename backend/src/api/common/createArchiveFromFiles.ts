import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { nanoid } from 'nanoid';

type Options = {
	cwd: string;
	tempCwd: string;
};

type ArchiveInfo = {
	url: string;
	size: number;
};

export function createArchiveFromFiles(relativePaths: string[], options: Options): Promise<ArchiveInfo> {
	return new Promise((resolve, reject) => {
		const basename = `${nanoid()}.zip`;
		const outputPath = path.join(options.tempCwd, '/.downloads/', basename);
		fs.mkdirSync(path.dirname(outputPath), {
			recursive: true,
		});

		const output = fs.createWriteStream(outputPath);
		const archive = archiver('zip', {
			zlib: { level: 9 }, // Sets the compression level.
		});

		archive.pipe(output);

		archive.on('error', function (err) {
			throw err;
		});

		archive.on('warning', function (err) {
			if (err.code === 'ENOENT') {
				// log warning
			} else {
				// throw error
				throw err;
			}
		});

		relativePaths.forEach((relativePath) => {
			archive.file(path.join(options.cwd, relativePath), { name: relativePath });
		});

		archive.finalize();

		output.on('close', () => {
			const stat = fs.statSync(outputPath);

			resolve({
				url: `http://localhost:3011/downloads/${basename}`,
				size: stat.size,
			});
		});
	});
}
