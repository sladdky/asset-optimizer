import { getAoFile } from '../common';
import { FileRepository } from '../repositories';
import debounce from 'lodash/debounce';
import chokidar from 'chokidar';
import { DebouncedFunc } from 'lodash';

type Props = {
	cwd: string;
	components: {
		fileRepository: FileRepository;
	};
};

//watch for changes in filesystem and update store accordingly
export function watchFsFilesComposition({ cwd, components }: Props) {
	return () => {
		const watcher = chokidar.watch('', {
			cwd: cwd,
			ignoreInitial: true,
			ignored: ['.ao-data'],
		});

		const queue: Record<string, DebouncedFunc<DebouncedFunc<() => void>>> = {};
		const addOrUpdateFile = (relativePath: string) => {
			if (!queue[relativePath]) {
				queue[relativePath] = debounce(() => {
					const aoFile = components['fileRepository'].findOne({
						query: {
							relativePath,
						},
					});

					if (!aoFile) {
						const aoFile = getAoFile({
							cwd,
							relativePath,
						});
						components['fileRepository'].create(aoFile);
					} else {
						components['fileRepository'].update(aoFile);
					}
				}, 500);
			}
			queue[relativePath].cancel();
			queue[relativePath]();
		};

		watcher.on('add', (relativePath) => {
			addOrUpdateFile(relativePath);
		});

		watcher.on('addDir', (relativePath) => {
			const aoFile = getAoFile({
				cwd,
				relativePath,
			});
			components['fileRepository'].create(aoFile);
		});

		watcher.on('change', (relativePath) => {
			addOrUpdateFile(relativePath);
		});

		watcher.on('unlink', (relativePath) => {
			//file could still be transfering to fs or wasnt added to db yet => remove from queue
			//@todo

			components['fileRepository'].deleteWhere({
				query: {
					relativePath,
				},
			});
		});

		watcher.on('unlinkDir', (relativePath) => {
			components['fileRepository'].deleteWhere({
				query: {
					relativePath,
				},
			});
		});
	};
}
