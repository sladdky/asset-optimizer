import { debounce } from 'lodash';
import { getFile } from '../common/getFile';
import { FileStore } from '../stores/FileStore';
import chokidar from 'chokidar';
import path from 'path';

type Props = {
	fileStore: FileStore;
	cwd: string;
};

//watch for changes in filesystem and update store accordingly
export function watchFsFilesComposition({ fileStore, cwd }: Props) {
	return () => {
		const watcher = chokidar.watch('', {
			cwd: cwd,
			ignoreInitial: true,
			ignored: ['.temp'],
		});

		const queue: Record<string, () => void> = {};
		const updateFileInStore = (relativePath: string) => {
			if (!queue[relativePath]) {
				queue[relativePath] = debounce(() => {
					fileStore.set(relativePath, getFile(path.join(cwd, relativePath)));
				}, 500);
			}
			queue[relativePath]();
		};

		watcher.on('add', (relativePath) => {
			updateFileInStore(relativePath);
		});

		watcher.on('change', (relativePath) => {
			updateFileInStore(relativePath);
		});
	};
}
