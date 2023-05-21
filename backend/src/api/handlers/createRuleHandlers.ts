import { RuleRepository } from '../../core/repositories';
import { AssetOptimizerRule, Response } from '../../types';

type Props = {
	components: {
		ruleRepository: RuleRepository;
	};
};

export function createRuleHandlers({ components }: Props) {
	return {
		deleteRule() {
			//todo
		},
		updateRule() {
			//todo
		},
		async listRule(callback: (res: Response<AssetOptimizerRule[]>) => void) {
			callback({
				data: await components['ruleRepository'].findAll(),
			});
		},
		async createRule(rule: Omit<AssetOptimizerRule, 'id'>) {
			await components['ruleRepository'].create(rule);
		},
	};
}
