import { PresetRuleRepository, RuleRepository } from '../repositories';
import { AssetOptimizerPresetRule } from '../types';

type Props = {
	components: {
		ruleRepository: RuleRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

// presetrule deleted
// ----
// 1. delete all rules associated to the presetrule
//
export function watchPresetRuleDeleteComposition({ components }: Props) {
	return () => {
		components['presetRuleRepository'].on('delete', (presetRule: AssetOptimizerPresetRule) => {
			components['ruleRepository'].deleteWhere({
				query: {
					presetRuleId: presetRule.id,
				},
			});
		});
	};
}
