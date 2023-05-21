import { FileRepository } from '../../core/repositories';
import { AssetOptimizerFile, Response } from '../../types';
import fs from 'fs/promises';

type Props = {
	components: {
		fileRepository: FileRepository;
	};
};

export function createFileHandlers({ components }: Props) {
	return {
		deleteFile() {
			//todo
		},
		updateFile() {
			//todo
		},
		async listFile(callback: (res: Response<AssetOptimizerFile[]>) => void) {
			callback({
				data: await components['fileRepository'].findAll(),
			});
			//todo
		},
		uploadFile() {
			//todo
		},
		readFile() {
			//todo
		},
		async createFile(aoFile: Omit<AssetOptimizerFile, 'id'>) {
			await fs.mkdir(aoFile.relativePath, {
				recursive: true,
			});

			if (!aoFile.isDir) {
				await fs.writeFile(aoFile.relativePath, '');
			}
		},
	};
}
