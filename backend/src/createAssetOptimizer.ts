import { coreComposition } from './core/compositions';
import { apiComposition } from './api/compositions';
import { uiComposition } from './ui/compositions';
import { AssetOptimizerApiConfig } from './api/types';
import { AssetOptimizerUiConfig } from './ui/types';
import { AssetOptimizerCoreConfig } from './core/types';
import Database from './core/database';
import { FileRepository, OptimizationRepository, RuleRepository, PresetRepository, PresetRuleRepository } from './core/repositories';
import path from 'path';

type AssetOptimizerWatchOptions = {
	api: boolean;
	ui: boolean;
};

type AssetOptimizerConfig = {
	core: Pick<AssetOptimizerCoreConfig, 'inputCwd' | 'outputCwd'> & Partial<AssetOptimizerCoreConfig>;
	api?: AssetOptimizerApiConfig;
	ui?: AssetOptimizerUiConfig;
};

export function createAssetOptimizer(config: AssetOptimizerConfig) {
	const { core: coreConfig, api: apiConfig = {}, ui: uiConfig = {} } = config;

	const tempCwd = path.join(coreConfig.inputCwd, '/.ao-data');

	const db = new Database({ cwd: tempCwd, dbName: 'db', autosave: true });

	const fileRepository = new FileRepository(db, 'files');
	const ruleRepository = new RuleRepository(db, 'rules');
	const optimizationRepository = new OptimizationRepository(db, 'optimizations');
	const presetRepository = new PresetRepository(db, 'presets');
	const presetRuleRepository = new PresetRuleRepository(db, 'preset-rules');

	const core = coreComposition({
		config: coreConfig,
		components: {
			fileRepository,
			ruleRepository,
			optimizationRepository,
			presetRepository,
			presetRuleRepository,
		},
	});

	const api = apiComposition({
		config: {
			port: 3011,
			...apiConfig,
		},
		components: {
			fileRepository,
			ruleRepository,
			optimizationRepository,
			presetRepository,
			presetRuleRepository,
			ruleDefs: core.getRuleDefs(),
		},
	});

	const ui = uiComposition({
		config: {
			port: 3010,
			...uiConfig,
		},
	});

	return {
		async watch(options: Partial<AssetOptimizerWatchOptions> = {}) {
			await db.load(); //db has to be loaded a awaited before using repositories !!!

			const _options: AssetOptimizerWatchOptions = {
				api: true,
				ui: true,
				...options,
			};

			await core.start();

			if (_options.api) {
				await api.start();
			}

			if (_options.ui) {
				await ui.start();
			}
		},
		core,
		api,
		ui,
	};
}
