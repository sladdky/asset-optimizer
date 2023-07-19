import { Express } from 'express';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import bodyParser from 'body-parser';

type Props = {
	expressApp: Express;
	tempCwd: string;
	inputCwd: string;
};

type Upload = {
	relativePath: string;
	size: number;
	token: string;
};

export function useUploaderComposition({ expressApp, tempCwd, inputCwd }: Props) {
	const pendingUploads: Upload[] = [];

	return () => {
		expressApp.use(bodyParser.json());

		expressApp.post('/upload-register', (req, res) => {
			if (!req.body) {
				res.writeHead(400);
				res.end();
				return;
			}

			// @todo all kinds of checks - data format, user has permission to upload, file size, file ext etc.
			let upload = pendingUploads.find((upload) => upload.relativePath === req.body.relativePath);
			if (!upload) {
				upload = {
					relativePath: req.body.relativePath,
					size: req.body.size,
					token: nanoid(),
				};

				pendingUploads.push(upload);
			}

			res.writeHead(200);
			res.end(JSON.stringify(upload), 'utf-8');
		});

		expressApp.post('/upload/:token/:chunkIndex', (req, res) => {
			const { token, chunkIndex } = req.params;

			// @todo check if its allowed to upload chunk
			const upload = pendingUploads.find((upload) => upload.token === token);
			if (!upload) {
				res.writeHead(403);
				res.end();
				return;
			}

			const chunkpath = path.join(tempCwd, `/.uploads/${token}/`, chunkIndex);
			fs.mkdirSync(path.dirname(chunkpath), {
				recursive: true,
			});

			const ws = fs.createWriteStream(chunkpath);
			ws.on('finish', () => {
				res.writeHead(200);
				res.end();
			});
			req.pipe(ws);
		});

		expressApp.post('/upload-end/:token', async (req, res) => {
			const { token } = req.params;

			const upload = pendingUploads.find((upload) => upload.token === token);
			if (!upload) {
				return;
			}

			const dir = path.join(tempCwd, `/.uploads/${token}/`);
			const concatedFilepath = path.join(dir, 'concated');

			const read = (filepath: string) =>
				new Promise((a, b) =>
					fs
						.createReadStream(filepath)
						.on('data', (a) => ws.write(a))
						.on('end', a)
						.on('error', b)
				);
			const chunks = (await fsp.readdir(dir)).filter((a) => a !== 'concated');
			const ws = fs.createWriteStream(concatedFilepath);

			for (const chunk of chunks) {
				const filename = path.join(dir, chunk);
				await read(filename);
				await fsp.unlink(filename);
			}

			ws.end();
			fs.renameSync(concatedFilepath, path.join(inputCwd, upload.relativePath));

			res.writeHead(200);
			res.end();
		});
	};
}
