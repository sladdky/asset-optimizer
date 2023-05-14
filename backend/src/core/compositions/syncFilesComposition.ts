import { getFiles } from '../common/getFiles';
import { FileStore } from '../stores/FileStore';

type Props = {
	fileStore: FileStore;
	cwd: string;
};

//synchronize files that are in store(loaded from json file) with filesystem structure
export function syncFilesComposition({ fileStore, cwd }: Props) {
	return () => {
		const fsFiles = getFiles('', {
			cwd,
			ignoredPaths: ['.temp'],
		});
		for (const relativePath in fsFiles) {
			const storeFile = fileStore.get(relativePath);
			const fsFile = fsFiles[relativePath];

			if (!storeFile) {
				fileStore.set(relativePath, fsFile);
			}

			if (storeFile && storeFile?.modified !== fsFiles[relativePath].modified) {
				fileStore.set(relativePath, {
					...storeFile,
					modified: fsFile.modified,
					optimized: false,
				});
			}
		}

		const storeFiles = fileStore.getAll();
		for (const relativePath in storeFiles) {
			if (!fsFiles[relativePath]) {
				fileStore.delete(relativePath);
			}
		}
	};
}
