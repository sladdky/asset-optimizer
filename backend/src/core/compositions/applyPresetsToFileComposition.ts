import { log } from '../../logger';
import { PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import { AssetOptimizerFile, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
		ruleRepository: RuleRepository;
	};
};

export function applyPresetsToFileComposition({ ruleDefs, components }: Props) {
	return (aoFile: AssetOptimizerFile) => {
		const presets = components['presetRepository'].findAll();

		try {
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
						// Invalid ruleName on presetrule. Couldnt find ruleDef.
						return;
					}

					if (!aoFile.ext.match(ruleDef.ext)) {
						// preset pattern is matching the file but this file extension cannot be optimized by selected ruledef
						return;
					}

					const rule = components['ruleRepository'].findOne({
						query: {
							$and: [
								{
									presetRuleId: {
										$eq: presetRule.id,
									},
								},
								{
									fileId: {
										$eq: aoFile.id,
									},
								},
							],
						},
					});
					if (rule) {
						// Rule created based on this presetrule already exists
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
		} catch (error) {
			if (error instanceof SyntaxError && error.message.startsWith('Invalid regular expression')) {
				log('CORE', `Preset regex: ${error.message}`, 'warning');
				return;
			}
			throw error;
		}
	};
}
