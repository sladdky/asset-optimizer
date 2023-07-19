import { FileRepository } from '../../core/repositories';
import { AssetOptimizerFile, DownloadInfo, Response } from '../../types';
import fs from 'fs/promises';
import path from 'path';
import { getPreviewImage, createArchiveFromFiles } from '../common';

type Props = {
	inputCwd: string;
	tempCwd: string;
	components: {
		fileRepository: FileRepository;
	};
};

export function createFileHandlers({ inputCwd, tempCwd, components }: Props) {
	return {
		deleteFile(id: number) {
			const aoFile = components['fileRepository'].findById(id);
			const fullpath = path.join(inputCwd, aoFile?.relativePath ?? '');

			fs.rm(fullpath);
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
		async downloadManyFile(ids: number[], callback: (res: Response<DownloadInfo>) => void) {
			const aoFiles = components['fileRepository'].find({
				query: {
					id: {
						$in: ids,
					},
				},
			});

			const relativePaths = aoFiles.map((aoFile) => aoFile.relativePath);
			const archive = await createArchiveFromFiles(relativePaths, {
				cwd: inputCwd,
				tempCwd,
			});

			callback({
				data: {
					url: archive.url,
					size: archive.size,
				},
			});
		},
		previewImageFile(id: number, callback: (res: Response<string>) => void) {
			const aoFile = components['fileRepository'].findById(id);
			const fullpath = path.join(inputCwd, aoFile?.relativePath ?? '');

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
