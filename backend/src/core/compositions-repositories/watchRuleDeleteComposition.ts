import { OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule } from '../types';

type Props = {
	components: {
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
	};
};

// rule deleted
// ----
// 1. delete all optimizations associated to this rule
// 2. run all errored optimizations for the file. Some might be resolved by removing others
//
export function watchRuleDeleteComposition({ components }: Props) {
	return () => {
		components['ruleRepository'].on('delete', (rule: AssetOptimizerRule) => {
			components['optimizationRepository'].deleteWhere({
				query: {
					ruleId: rule.id,
				},
			});

			const otherErroredRules = components['ruleRepository'].find({
				query: {
					$and: [
						{
							fileId: {
								$eq: rule.fileId,
							},
						},
						{
							state: {
								$eq: 'error',
							},
						},
					],
				},
			});

			otherErroredRules.forEach((erroredRule) => {
				erroredRule.state = '';
			});

			components['ruleRepository'].updateMany(otherErroredRules);
		});
	};
}
