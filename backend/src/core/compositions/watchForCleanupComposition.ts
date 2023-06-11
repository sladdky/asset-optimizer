import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import { AssetOptimizerFile, AssetOptimizerPresetRule, AssetOptimizerRule } from '../types';

type Props = {
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
		presetRuleRepository: PresetRuleRepository;
		presetRepository: PresetRepository;
	};
};

export function watchForCleanupComposition({ components }: Props) {
	return () => {
		components['fileRepository'].on('delete', (aoFile: AssetOptimizerFile) => {
			components['ruleRepository'].deleteWhere({
				query: {
					fileId: aoFile.id,
				},
			});
		});

		components['ruleRepository'].on('delete', (rule: AssetOptimizerRule) => {
			components['optimizationRepository'].deleteWhere({
				query: {
					ruleId: rule.id,
				},
			});
		});

		components['presetRuleRepository'].on('delete', (presetRule: AssetOptimizerPresetRule) => {
			components['ruleRepository'].deleteWhere({
				query: {
					presetRuleId: presetRule.id,
				},
			});
		});

		components['presetRepository'].on('delete', (preset: AssetOptimizerRule) => {
			const presetRules = components['presetRuleRepository'].find({
				query: {
					presetId: {
						$eq: preset.id,
					},
				},
			});

			presetRules.forEach((presetRule) => {
				components['ruleRepository'].deleteWhere({
					query: {
						presetRuleId: presetRule.id,
					},
				});
			});
		});
	};
}
