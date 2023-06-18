import { OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		optimizationRepository: OptimizationRepository;
		ruleRepository: RuleRepository;
	};
};

// rule beforeupdated
// ----
// CASE 1
// 1. make sure ruleData for optimization are valid before saving to db
//
// CASE 2
// 1. if ruleData changes => delete all optimizations and run new optimizations
//
export function watchRuleBeforeUpdateComposition({ ruleDefs, components }: Props) {
	return () => {
		components['ruleRepository'].on('before-update', (rule: AssetOptimizerRule) => {
			const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === rule.ruleName);
			rule.data = ruleDef?.processData(rule.data);
			return rule;
		});

		components['ruleRepository'].on('before-update', (rule: AssetOptimizerRule) => {
			const oldRule = components['ruleRepository'].findById(rule.id);

			if (oldRule && JSON.stringify(rule.data) !== JSON.stringify(oldRule.data)) {
				components['optimizationRepository'].deleteWhere({
					query: {
						ruleId: {
							$eq: rule.id,
						},
					},
				});

				rule.state = '';
			}

			return rule;
		});

	};
}
