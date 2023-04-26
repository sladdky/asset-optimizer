import path from 'path';
import { AssetOptimizerConfig } from './types';
import { FileStore, PresetStore } from './stores';
import { loadStoresComposition, syncFilesComposition, watchFsFilesComposition, watchStoreFilesForOptimizationComposition } from './compositions';
import { fallbackCallback, imageCallback, svgCallback, videoCallback } from './rules';

type CustomConfig = Pick<AssetOptimizerConfig, 'inputCwd' | 'outputCwd' | 'tempCwd'> & Partial<AssetOptimizerConfig>;

export function createAssetOptimizer(customConfig: CustomConfig) {
	const config: AssetOptimizerConfig = {
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
			'': {
				callback: fallbackCallback,
			},
			...customConfig.rules,
		},
	};

	const fileStore = new FileStore(path.join(customConfig.tempCwd, 'files.json'));
	const presetStore = new PresetStore(path.join(customConfig.tempCwd, 'preset.json'));

	const watch = async () => {
		console.log('1/6 Loading stores...');
		const loadStores = loadStoresComposition({
			fileStore,
			presetStore,
		});
		await loadStores();

		console.log('2/6 Watching for optimization requests...');
		const watchForOptimization = watchStoreFilesForOptimizationComposition({
			fileStore,
			cwd: config.inputCwd,
			outputCwd: config.outputCwd,
			rules: config.rules,
		});
		await watchForOptimization();

		console.log('3/6 Synchronizing files to store...');
		const syncFiles = syncFilesComposition({ fileStore, cwd: config.inputCwd });
		syncFiles();

		console.log('4/6 Watching for changes in filesystem...');
		const watchFs = watchFsFilesComposition({
			fileStore,
			cwd: config.inputCwd,
		});
		watchFs();

		console.log('5/6 Starting websocket server... - cooming soon');
		// const runWebsocket = runWebsocketComposition({
			// 	port: 3003,
			// });
			// runWebsocket();

		console.log('5/6 Starting UI... - cooming soon');
		// expressApp.start()
	};

	return {
		watch,
	};
}
