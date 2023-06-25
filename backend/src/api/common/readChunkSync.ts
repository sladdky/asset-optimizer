// import { promisify } from 'util';
import fs from 'fs';
import { Buffer } from 'buffer';
// import pify from 'pify';

// const fsReadP = pify(fs.read, { multiArgs: true });
// const fsOpenP = promisify(fs.open);
// const fsCloseP = promisify(fs.close);

// export async function readChunk(filePath, {length, startPosition}) {
// 	const fileDescriptor = await fsOpenP(filePath, 'r');

// 	try {
// 		let [bytesRead, buffer] = await fsReadP(fileDescriptor, {
// 			buffer: Buffer.alloc(length),
// 			length,
// 			position: startPosition,
// 		});

// 		if (bytesRead < length) {
// 			buffer = buffer.subarray(0, bytesRead);
// 		}

// 		return buffer;
// 	} finally {
// 		await fsCloseP(fileDescriptor);
// 	}
// }

type Options = {
	length: number;
	startPosition?: number;
};

export function readChunkSync(filePath: string, { length, startPosition }: Options) {
	let buffer = Buffer.alloc(length);
	const fileDescriptor = fs.openSync(filePath, 'r');

	try {
		const bytesRead = fs.readSync(fileDescriptor, buffer, {
			length,
			position: startPosition,
		});

		if (bytesRead < length) {
			buffer = buffer.subarray(0, bytesRead);
		}

		return buffer;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
