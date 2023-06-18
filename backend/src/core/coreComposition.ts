import { AssetOptimizerCoreConfig, AssetOptimizerRuleDef } from './types';
import { FileRepository, OptimizationRepository, RuleRepository, PresetRepository, PresetRuleRepository } from './repositories';
import {
	watchFsFilesComposition,
	syncComposition,
	watchForOptimizationComposition,
	watchRepositoriesComposition,
} from './compositions';
import { copyRuleDef, imageAutoRuleDef, imageCropRuleDef, svgAutoRuleDef, videoAutoRuleDef } from './rule-defs';

type Props = {
	config: Pick<AssetOptimizerCoreConfig, 'inputCwd' | 'outputCwd'> & Partial<AssetOptimizerCoreConfig>;
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
			console.error(
				'\x1b[31m',
				`WARNING: Rule '${ruleDef.ruleName}' already exists. If you wish to override the rule, pass {override:true} to options.`,
				'\x1b[30m'
			);
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
			console.log('1/4 CORE:Synchronizing filesystem...');
			const sync = syncComposition({
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
				ruleDefs,
				components,
			});
			await sync();

			console.log('2/4 CORE:Watching repositories ...');
			const watchRepositories = watchRepositoriesComposition({
				outputCwd: config.outputCwd,
				ruleDefs,
				components
			});
			watchRepositories();


			console.log('3/4 CORE:Watching filesystem changes...');
			const watchFsFiles = watchFsFilesComposition({
				cwd: config.inputCwd,
				components,
			});
			await watchFsFiles();

			console.log('4/4 CORE:Watching for pending optimizations...');
			const watchForOptimization = watchForOptimizationComposition({
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
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
