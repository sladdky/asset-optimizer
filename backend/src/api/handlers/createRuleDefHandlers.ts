import { AssetOptimizerRuleDef, AssetOptimizerUiRuleDef, Response } from '../../types';

type Props = {
	components: {
		ruleDefs: AssetOptimizerRuleDef[];
	};
};

export function createRuleDefHandlers({ components }: Props) {
	return {
		async listRuleDef(callback: (res: Response<AssetOptimizerUiRuleDef[]>) => void) {
			callback({
				data: components.ruleDefs,
			});
			//todo
		},
	};
}
