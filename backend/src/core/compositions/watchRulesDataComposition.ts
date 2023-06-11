import { RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		ruleRepository: RuleRepository;
	};
};

export function supplyDefaultDataToNewRulesComposition({ ruleDefs, components }: Props) {
	return () => {
		components['ruleRepository'].on('before-create', (rule: AssetOptimizerRule) => {
			const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === rule.ruleName);
			const data = ruleDef?.processData(rule.data);
			rule.data = data;
			return rule;
		});

		components['ruleRepository'].on('before-update', (rule: AssetOptimizerRule) => {
			const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === rule.ruleName);
			rule.data = ruleDef?.processData(rule.data);
			return rule;
		});
	};
}
