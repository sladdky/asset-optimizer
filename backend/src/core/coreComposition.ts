import { AssetOptimizerCoreConfig, AssetOptimizerRuleDef } from './types';
import { FileRepository, OptimizationRepository, RuleRepository, PresetRepository } from './repositories';
import {
	watchFsFilesComposition,
	scanFsFilesComposition,
	supplyDefaultDataToNewRulesComposition,
	watchForOptimizationComposition,
	watchForCleanupComposition,
	watchPresetsComposition,
	watchRulesComposition,
} from './compositions';
import { copyRuleDef, imageAutoRuleDef, imageCropRuleDef, svgAutoRuleDef, videoAutoRuleDef } from './rule-defs';
import { PresetRuleRepository } from './repositories/PresetRuleRepository';

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
			console.log('1/7 CORE:Scanning filesystem...');
			const scanFsFiles = scanFsFilesComposition({
				cwd: config.inputCwd,
				components,
			});
			await scanFsFiles();

			console.log('2/7 CORE:Watching rule changes ...');
			const watchRules = watchRulesComposition({
				components,
			});
			watchRules();

			console.log('3/7 CORE:Watching rule data for validation...');
			const supplyDefaultDataToNewRules = supplyDefaultDataToNewRulesComposition({
				ruleDefs,
				components,
			});
			supplyDefaultDataToNewRules();

			console.log('4/7 CORE:Watching presets...');
			const watchPresets = watchPresetsComposition({
				ruleDefs,
				components,
			});
			await watchPresets();

			console.log('5/7 CORE:Watching filesystem changes...');
			const watchFsFiles = watchFsFilesComposition({
				cwd: config.inputCwd,
				components,
			});
			await watchFsFiles();

			console.log('6/7 CORE:Watching optimization requests...');
			const watchForOptimization = watchForOptimizationComposition({
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
				ruleDefs,
				components,
			});
			await watchForOptimization();

			console.log('7/7 CORE:Watching for deleted rules,files and presets...');
			const watchForCleanup = watchForCleanupComposition({
				components,
			});
			watchForCleanup();
		},
		addRuleDef,
		getRuleDefs() {
			return ruleDefs;
		},
	};
}
