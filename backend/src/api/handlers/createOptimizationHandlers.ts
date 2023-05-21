import { OptimizationRepository } from '../../core/repositories';
import { AssetOptimizerOptimization, Response } from '../../types';

type Props = {
	components: {
		optimizationRepository: OptimizationRepository;
	};
};

export function createOptimizationHandlers({ components }: Props) {
	return {
		async listOptimization(callback: (res: Response<AssetOptimizerOptimization[]>) => void) {
			callback({
				data: await components['optimizationRepository'].findAll(),
			});
			//todo
		},
	};
}
