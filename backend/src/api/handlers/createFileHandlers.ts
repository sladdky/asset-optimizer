import { FileRepository } from '../../core/repositories';
import { AssetOptimizerFile, Response } from '../../types';
import fs from 'fs/promises';
import path from 'path'
import { getPreviewImage } from '../common/getPreviewImage'

type Props = {
	inputCwd: string
	components: {
		fileRepository: FileRepository;
	};
};

export function createFileHandlers({ inputCwd, components }: Props) {
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
		readFilePreviewImage(id: number, callback: (res: Response<string>) => void) {
			const aoFile = components['fileRepository'].findById(id)
			const fullpath = path.join(inputCwd, aoFile?.relativePath ?? '')

			callback({
				data: getPreviewImage(fullpath),
			});
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
