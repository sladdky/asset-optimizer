import { Express } from 'express';
import fs from 'fs';
import path from 'path';

type Props = {
	expressApp: Express;
	tempCwd: string;
};

export function useDownloadableFilesComposition({ expressApp, tempCwd }: Props) {
	return () => {
		expressApp.get('/downloads/:basename', (req, res) => {
			const filename = path.join(tempCwd, '/.downloads/', req.params.basename);

			fs.readFile(filename, function (error, content) {
				if (error) {
					if (error.code === 'ENOENT' || error.code === 'EISDIR') {
						res.writeHead(404);
						res.end('Not found');
						res.end();
					} else {
						res.writeHead(500);
						res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
						res.end();
					}
				} else {
					res.writeHead(200);
					res.end(content, 'utf-8');
				}
			});
		});
	};
}
