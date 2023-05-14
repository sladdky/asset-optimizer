import { AssetOptimizerCoreConfig, AssetOptimizerRules } from './types';
import { fallbackCallback, imageCallback, svgCallback, videoCallback } from './rules';
import { FileStore } from './stores';
import { loadStoresComposition } from './compositions/loadStoresComposition';
import { syncFilesComposition } from './compositions/syncFilesComposition';
import { watchFsFilesComposition } from './compositions/watchFsFilesComposition';
import { watchStoreFilesForOptimizationComposition } from './compositions/watchStoreFilesForOptimizationComposition';

type Props = {
	config: Pick<AssetOptimizerCoreConfig, 'inputCwd' | 'outputCwd'> & Partial<AssetOptimizerCoreConfig>;
	fileStore: FileStore;
};

export function startCoreComposition({ config: customConfig, fileStore }: Props) {
	const config: AssetOptimizerCoreConfig = {
		...customConfig,
		rules: {
			'jpg|jpeg|png': {
				callback: imageCallback,
			},
			'mov|mp4': {
				callback: videoCallback,
			},
			svg: {
				callback: svgCallback,
			},
			...customConfig.rules,
			'': {
				callback: fallbackCallback,
			},
		},
	};

	return async () => {
		console.log('1/4 CORE:Loading stores...');
		const loadStores = loadStoresComposition({
			fileStore,
		});
		await loadStores();

		console.log('2/4 CORE:Watching for optimization requests...');
		const watchForOptimization = watchStoreFilesForOptimizationComposition({
			inputCwd: config.inputCwd,
			outputCwd: config.outputCwd,
			rules: config.rules,
			fileStore,
		});
		await watchForOptimization();

		console.log('3/4 CORE:Synchronizing files to store...');
		const syncFiles = syncFilesComposition({
			cwd: config.inputCwd,
			fileStore,
		});
		syncFiles();

		console.log('4/4 CORE:Watching for changes in filesystem...');
		const watchFsFiles = watchFsFilesComposition({
			cwd: config.inputCwd,
			fileStore,
		});
		watchFsFiles();
	};
}
