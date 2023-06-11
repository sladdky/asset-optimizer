import { FileRepository, OptimizationRepository, RuleRepository } from '../repositories';
import { PresetRepository } from '../repositories/PresetRepository';
import { PresetRuleRepository } from '../repositories/PresetRuleRepository';
import { AssetOptimizerFile, AssetOptimizerPreset, AssetOptimizerPresetRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		presetRepository: PresetRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

export function watchPresetsComposition({ ruleDefs, components }: Props) {
	//new presetrule => create rule on all matching files
	const handleNewPresetRule = (presetRule: AssetOptimizerPresetRule) => {
		const preset = components['presetRepository'].findById(presetRule.presetId);
		if (!preset) {
			//'Invalid presetId on presetrule. Couldnt find preset.'
			return;
		}

		const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === presetRule.ruleName);
		if (!ruleDef) {
			//'Invalid ruleName on presetrule. Couldnt find ruleDef.'
			return;
		}

		const aoFiles = components['fileRepository'].find({
			query: {
				$and: [
					{
						relativePath: {
							$regex: `^${preset.pattern}$`,
						},
					},
					{
						ext: {
							$regex: ruleDef.ext,
						},
					},
				],
			},
		});

		aoFiles.forEach((aoFile) => {
			components['ruleRepository'].create({
				fileId: aoFile.id,
				relativePath: aoFile.relativePath,
				ruleName: presetRule.ruleName,
				presetRuleId: presetRule.id,
				data: presetRule.data,
			});
		});
	};

	//updated presetrule => mark all existing rules as unoptimized to trigger new optimization
	const handleUpdatePresetRule = (presetRule: AssetOptimizerPresetRule) => {
		const preset = components['presetRepository'].findById(presetRule.presetId);
		if (!preset) {
			console.log('Invalid presetId on presetrule:');
			return;
		}

		const rules = components['ruleRepository'].find({
			query: {
				presetRuleId: {
					$eq: presetRule.id,
				},
			},
		});
		rules.forEach((rule) => {
			rule.state = '';
			rule.data = presetRule.data;
			components['ruleRepository'].update(rule);
		});
	};

	//new file => check all presets, their rules and apply them
	const handleNewFile = (aoFile: AssetOptimizerFile) => {
		const presets = components['presetRepository'].findAll();

		const matchingPresets = presets.filter((preset) => aoFile.relativePath.match(preset.pattern));
		matchingPresets.forEach((preset) => {
			const presetRules = components['presetRuleRepository'].find({
				query: {
					presetId: preset.id,
				},
			});

			presetRules.forEach((presetRule) => {
				const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === presetRule.ruleName);
				if (!ruleDef) {
					// 'Invalid ruleName on presetrule. Couldnt find ruleDef.'
					return;
				}

				if (!aoFile.ext.match(ruleDef.ext)) {
					return;
				}

				components['ruleRepository'].create({
					fileId: aoFile.id,
					relativePath: aoFile.relativePath,
					ruleName: presetRule.ruleName,
					presetRuleId: presetRule.id,
					data: presetRule.data,
				});
			});
		});
	};

	return async () => {
		components['presetRuleRepository'].on('create', (presetRule: AssetOptimizerPresetRule) => {
			handleNewPresetRule(presetRule);
		});
		components['presetRuleRepository'].on('update', (presetRule: AssetOptimizerPresetRule) => {
			handleUpdatePresetRule(presetRule);
		});

		components['fileRepository'].on('create', (aoFile: AssetOptimizerFile) => {
			handleNewFile(aoFile);
		});

		if (process.env.cli) {
			if (!components['presetRepository'].findById(1)) {
				const preset = components['presetRepository'].create({
					pattern: '.*',
				});
				if (preset) {
					components['presetRuleRepository'].create({
						presetId: preset.id,
						ruleName: 'svgAuto',
					});
					components['presetRuleRepository'].create({
						presetId: preset.id,
						ruleName: 'imageAuto',
					});
					components['presetRuleRepository'].create({
						presetId: preset.id,
						ruleName: 'videoAuto',
					});
				}
			}
		}
	};
}
