import { RuleRepository } from '../../core/repositories';
import { AssetOptimizerRule, Response } from '../../types';

type Props = {
	components: {
		ruleRepository: RuleRepository;
	};
};

export function createRuleHandlers({ components }: Props) {
	return {
		deleteRule(id: number) {
			components['ruleRepository'].deleteById(id);
		},
		updateRule(rule: AssetOptimizerRule) {
			components['ruleRepository'].update(rule);
		},
		listRule(callback: (res: Response<AssetOptimizerRule[]>) => void) {
			callback({
				data: components['ruleRepository'].findAll(),
			});
		},
		createRule(rule: Omit<AssetOptimizerRule, 'id'>) {
			components['ruleRepository'].create(rule);
		},
		resetRule(id: number) {
			const rule = components['ruleRepository'].findById(id);
			if (rule) {
				rule.state = '';
				components['ruleRepository'].update(rule);
			}
		},
	};
}
