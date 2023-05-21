import { debounce } from 'lodash';
import { getAoFile } from '../common/getAoFile';
import { FileRepository } from '../repositories/FileRepository';
import chokidar from 'chokidar';

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
			ignored: ['.temp'],
		});

		const queue: Record<string, () => void> = {};
		const updateFile = (relativePath: string) => {
			if (!queue[relativePath]) {
				queue[relativePath] = debounce(async () => {
					const aoFile = await components['fileRepository'].findOne({
						query: {
							relativePath,
						},
					});
					if (!aoFile) {
						return;
					}
					components['fileRepository'].update(aoFile);
				}, 500);
			}
			queue[relativePath]();
		};

		watcher.on('add', (relativePath) => {
			const aoFile = getAoFile({
				cwd,
				relativePath,
			});
			components['fileRepository'].create(aoFile);
		});

		watcher.on('addDir', (relativePath) => {
			const aoFile = getAoFile({
				cwd,
				relativePath,
			});
			components['fileRepository'].create(aoFile);
		});

		watcher.on('change', async (relativePath) => {
			updateFile(relativePath);
		});

		watcher.on('unlink', (relativePath) => {
			components['fileRepository'].remove({
				query: {
					relativePath,
				},
			});
		});

		watcher.on('unlinkDir', (relativePath) => {
			components['fileRepository'].remove({
				query: {
					relativePath,
				},
			});
		});
	};
}
