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
// 1. delete all optimizations associated to this preset
// 2. @todo: run all errored optimizations for the file? some might be resolved by removing others
//
export function watchRuleDeleteComposition({ components }: Props) {
	return () => {
		components['ruleRepository'].on('delete', (rule: AssetOptimizerRule) => {
			components['optimizationRepository'].deleteWhere({
				query: {
					ruleId: rule.id,
				},
			});
		});
	};
}
