import { optimizeFile } from '../common/optimizeFile';
import { EmitsNeedsOptimizationProps, FileStore } from '../stores/FileStore';
import { AssetOptimizerRules } from '../types';
import { EMITS as FILESTORE_EMITS } from '../stores/FileStore';

type Props = {
	fileStore: FileStore;
	cwd: string;
	outputCwd: string;
	rules: AssetOptimizerRules;
};

//once store reports that a file needs optimization, run optimization
export function watchStoreFilesForOptimizationComposition({ fileStore, cwd, outputCwd, rules }: Props) {
	return () => {
		const MAX_COUNT_IN_PARALLEL = 5;
		const queue: string[] = [];
		let count = 0;

		const optimize = async (relativePath: string) => {
			const storeFile = fileStore.get(relativePath);
			if (storeFile && !storeFile.isDir) {
				count += 1;

				const wasOptimized = await optimizeFile(relativePath, {
					cwd,
					outputCwd,
					rules,
					additionalData: storeFile,
				});

				if (wasOptimized) {
					fileStore.set(relativePath, {
						...storeFile,
						optimized: true,
					});
				}

				count -= 1;
			}

			runQueue();
		};

		const runQueue = () => {
			if (count > MAX_COUNT_IN_PARALLEL) {
				return;
			}

			const key = queue.shift();
			if (!key) {
				return;
			}

			optimize(key);
		};

		fileStore.on(FILESTORE_EMITS.NEEDS_OPTIMIZATION, ({ key }: EmitsNeedsOptimizationProps) => {
			queue.push(key);
			runQueue();
		});
	};
}
