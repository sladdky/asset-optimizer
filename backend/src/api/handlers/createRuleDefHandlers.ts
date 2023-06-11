import { AssetOptimizerRuleDef, Response } from '../../types';

type Props = {
	components: {
		ruleDefs: AssetOptimizerRuleDef[];
	};
};

export function createRuleDefHandlers({ components }: Props) {
	return {
		listRuleDef(callback: (res: Response<AssetOptimizerRuleDef[]>) => void) {
			callback({
				data: components.ruleDefs,
			});
		},
	};
}
