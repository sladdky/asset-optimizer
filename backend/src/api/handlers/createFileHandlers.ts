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
		listFile(callback: (res: Response<AssetOptimizerFile[]>) => void) {
			callback({
				data: components['fileRepository'].findAll(),
			});
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
