import { startCoreComposition, createStoreComposition } from './core/compositions';
import { startApiComposition } from './api/compositions';
import { AssetOptimizerApiConfig } from './api/types';
import { startUiComposition } from './ui/compositions';
import { AssetOptimizerUiConfig } from './ui/types';
import { AssetOptimizerCoreConfig, AssetOptimizerRules } from './core/types';

type AssetOptimizerWatchOptions = {
	api: boolean;
	ui: boolean;
};

type AssetOptimizerConfig = Pick<AssetOptimizerCoreConfig, 'inputCwd' | 'outputCwd'> &
	Partial<AssetOptimizerCoreConfig> &
	Partial<{
		api: AssetOptimizerApiConfig;
		ui: AssetOptimizerUiConfig;
	}>;

export function createAssetOptimizer(config: AssetOptimizerConfig) {
	const { api: apiConfig = {}, ui: uiConfig = {}, ...coreConfig } = config;

	const createStore = createStoreComposition({ cwd: coreConfig.inputCwd });

	const fileStore = createStore('FileStore', 'files.json');

	const startCore = startCoreComposition({
		config: coreConfig,
		fileStore,
	});

	const startApi = startApiComposition({
		config: {
			port: 3011,
			...apiConfig,
		},
		fileStore,
	});

	const startUi = startUiComposition({
		config: {
			port: 3010,
			...uiConfig,
		},
	});

	return {
		async watch(options: Partial<AssetOptimizerWatchOptions> = {}) {
			const _options: AssetOptimizerWatchOptions = {
				api: true,
				ui: true,
				...options,
			};

			await startCore();

			if (_options.api) {
				await startApi();
			}

			if (_options.ui) {
				await startUi();
			}
		},
	};
}
