import { Server } from 'http';
import fs from 'fs';
import path from 'path';

type Props = {
	httpServer: Server;
	tempCwd: string;
};

export function serveDownloadableFilesComposition({ httpServer, tempCwd }: Props) {
	return () => {
		httpServer.on('request', (req, res) => {
			if (req.url?.startsWith('/downloads/')) {
				const urlparts = req.url.split('/');
				const basename = urlparts[urlparts.length - 1];
				const filename = path.join(tempCwd, '/.downloads/', basename);
				// const ext = path.extname(filename);

				// let contentType = 'text/html';
				// switch (ext) {
				// 	case '.zip':
				// 		contentType = 'application/zip';
				// 		break;
				// }

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
			}
		});
	};
}
