import { AssetOptimizerCoreConfig, AssetOptimizerRuleDef } from './types';
import { FileRepository, OptimizationRepository, RuleRepository, PresetRepository, PresetRuleRepository } from './repositories';
import { watchFsFilesComposition, syncComposition, watchForOptimizationComposition, watchRepositoriesComposition } from './compositions';
import { copyRuleDef, imageAutoRuleDef, imageCropRuleDef, svgAutoRuleDef, videoAutoRuleDef } from './rule-defs';
import { log } from '../logger';

type Props = {
	config: Pick<AssetOptimizerCoreConfig, 'inputCwd' | 'outputCwd' | 'tempCwd'> & Partial<AssetOptimizerCoreConfig>;
	components: {
		fileRepository: FileRepository;
		optimizationRepository: OptimizationRepository;
		ruleRepository: RuleRepository;
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

export function coreComposition({ config, components }: Props) {
	const ruleDefs: AssetOptimizerRuleDef[] = [];

	type AddRuleDefOptions = {
		override: boolean;
	};

	const addRuleDef = (ruleDef: AssetOptimizerRuleDef, options: Partial<AddRuleDefOptions> = {}) => {
		if (ruleDefs.find((_ruleDef) => _ruleDef.ruleName === ruleDef.ruleName) && !options.override) {
			log('CORE', `Rule '${ruleDef.ruleName}' already exists. If you wish to override the rule, pass {override:true} to options.`, 'warning');
		}

		ruleDefs.push(ruleDef);
	};

	addRuleDef(imageAutoRuleDef);
	addRuleDef(imageCropRuleDef);
	addRuleDef(videoAutoRuleDef);
	addRuleDef(svgAutoRuleDef);
	addRuleDef(copyRuleDef);

	return {
		start: async () => {
			log('CORE', 'Synchronizing filesystem...');
			const sync = syncComposition({
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
				ruleDefs,
				components,
			});
			await sync();

			log('CORE', 'Watching repositories...');
			const watchRepositories = watchRepositoriesComposition({
				outputCwd: config.outputCwd,
				ruleDefs,
				components,
			});
			watchRepositories();

			log('CORE', 'Watching filesystem changes...');
			const watchFsFiles = watchFsFilesComposition({
				cwd: config.inputCwd,
				components,
			});
			await watchFsFiles();

			log('CORE', 'Watching for pending optimizations...');
			const watchForOptimization = watchForOptimizationComposition({
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
				tempCwd: config.tempCwd,
				ruleDefs,
				components,
			});
			await watchForOptimization();
		},
		addRuleDef,
		getRuleDefs() {
			return ruleDefs;
		},
	};
}
