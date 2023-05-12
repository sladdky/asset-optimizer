import path from 'path';
import fs from 'fs';
import { AssetOptimizerConfig } from './_shared/types';
import { FileStore, PresetStore } from './stores';
import { loadStoresComposition, syncFilesComposition, watchFsFilesComposition, watchStoreFilesForOptimizationComposition } from './compositions';
import { fallbackCallback, imageCallback, svgCallback, videoCallback } from './rules';
import { runWebsocketServerComposition } from './compositions/runWebsocketServerComposition';
import { runExpressAppComposition } from './compositions/runExpressAppComposition';

type CustomConfig = Pick<AssetOptimizerConfig, 'inputCwd' | 'outputCwd'> & Partial<AssetOptimizerConfig>;

type AssetOptimizerWatchOptions = {
	isWebsocketServer: boolean;
	isExpress: boolean;
};

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
			...customConfig.rules,
			'': {
				callback: fallbackCallback,
			},
		},
	};

	const tempCwd = path.join(customConfig.inputCwd, '/.temp');
	fs.mkdirSync(tempCwd, { recursive: true });

	const fileStore = new FileStore(path.join(tempCwd, '/files.json'));
	const presetStore = new PresetStore(path.join(tempCwd, '/preset.json'));

	const startFsWatcher = async () => {
		console.log('1/4 Loading stores...');
		const loadStores = loadStoresComposition({
			fileStore,
			presetStore,
		});
		await loadStores();

		console.log('2/4 Watching for optimization requests...');
		const watchForOptimization = watchStoreFilesForOptimizationComposition({
			fileStore,
			inputCwd: config.inputCwd,
			outputCwd: config.outputCwd,
			rules: config.rules,
		});
		await watchForOptimization();

		console.log('3/4 Synchronizing files to store...');
		const syncFiles = syncFilesComposition({ fileStore, cwd: config.inputCwd });
		syncFiles();

		console.log('4/4 Watching for changes in filesystem...');
		const watchFsFiles = watchFsFilesComposition({
			fileStore,
			cwd: config.inputCwd,
		});
		watchFsFiles();
	};

	const startWebsocketServer = async () => {
		console.log('1/2 Starting websocket server...');
		const runWebsocketServer = runWebsocketServerComposition({
			fileStore,
			port: 3011,
		});
		runWebsocketServer();
	};

	const startExpress = async () => {
		console.log('2/2 Starting UI...');
		const runExpressApp = runExpressAppComposition({
			port: 3010,
		});
		runExpressApp();

		console.log(`Running asset-optimizer at http://localhost:${3010}/`);
	};

	return {
		watch: async (options: Partial<AssetOptimizerWatchOptions> = {}) => {
			const _options: AssetOptimizerWatchOptions = {
				isWebsocketServer: true,
				isExpress: true,
				...options,
			};

			await startFsWatcher();

			if (_options.isWebsocketServer) {
				await startWebsocketServer();
			}
			if (_options.isExpress) {
				await startExpress();
			}
		},
	};
}
