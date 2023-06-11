import { OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule } from '../types';

type Props = {
	components: {
		optimizationRepository: OptimizationRepository;
		ruleRepository: RuleRepository;
	};
};

export function watchRulesComposition({ components }: Props) {
	return () => {
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
