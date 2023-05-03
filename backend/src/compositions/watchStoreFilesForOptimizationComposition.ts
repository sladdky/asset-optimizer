import { optimizeFile } from '../common/optimizeFile';
import { FileStore } from '../stores/FileStore';
import { AssetOptimizerRules } from '../../../_shared/types';

type Props = {
	fileStore: FileStore;
	inputCwd: string;
	outputCwd: string;
	rules: AssetOptimizerRules;
};

//once store reports that a file needs optimization, run optimization
export function watchStoreFilesForOptimizationComposition({ fileStore, inputCwd, outputCwd, rules }: Props) {
	return () => {
		const MAX_COUNT_IN_PARALLEL = 5;
		const queue: string[] = [];
		let count = 0;

		const optimize = async (relativePath: string) => {
			const storeFile = fileStore.get(relativePath);
			if (storeFile && !storeFile.isDir) {
				count += 1;

				const wasOptimized = await optimizeFile(relativePath, {
					inputCwd,
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

		fileStore.on('needs-optimization', ({ key }) => {
			queue.push(key);
			runQueue();
		});
	};
}
