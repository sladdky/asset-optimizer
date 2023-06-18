import { RuleRepository, PresetRepository, PresetRuleRepository } from '../repositories';
import { AssetOptimizerPresetRule } from '../types';

type Props = {
	components: {
		presetRepository: PresetRepository;
		ruleRepository: RuleRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

// presetrule updated
// ----
// 1. find all rules created by this presetrule and update them to trigger new optimization
//
export function watchPresetRuleUpdateComposition({ components }: Props) {
	return () => {
		components['presetRuleRepository'].on('update', (presetRule: AssetOptimizerPresetRule) => {
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
		});
	};
}
