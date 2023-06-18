import { RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		ruleRepository: RuleRepository;
	};
};

// rule beforecreated
// ----
// 1. make sure ruleData for optimization are valid before saving to db
//
export function watchRuleBeforeCreateComposition({ ruleDefs, components }: Props) {
	return () => {
		components['ruleRepository'].on('before-create', (rule: AssetOptimizerRule) => {
			const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === rule.ruleName);
			const data = ruleDef?.processData(rule.data);
			rule.data = data;
			return rule;
		});
	};
}
