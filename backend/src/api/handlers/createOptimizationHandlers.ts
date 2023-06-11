import { OptimizationRepository } from '../../core/repositories';
import { AssetOptimizerOptimization, Response } from '../../types';

type Props = {
	components: {
		optimizationRepository: OptimizationRepository;
	};
};

export function createOptimizationHandlers({ components }: Props) {
	return {
		listOptimization(callback: (res: Response<AssetOptimizerOptimization[]>) => void) {
			callback({
				data: components['optimizationRepository'].findAll(),
			});
		},
	};
}
