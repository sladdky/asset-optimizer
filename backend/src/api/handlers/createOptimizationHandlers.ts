import { OptimizationRepository } from '../../core/repositories';
import { AssetOptimizerOptimization, Response } from '../../types';
import fs from 'fs'
import path from 'path'
import { getPreviewImage } from '../common/getPreviewImage'

type Props = {
	outputCwd: string;
	components: {
		optimizationRepository: OptimizationRepository;
	};
};

export function createOptimizationHandlers({ outputCwd, components }: Props) {
	return {
		readOptimizationPreviewImage(id: number, callback: (res: Response<string>) => void) {
			const optimization = components['optimizationRepository'].findById(id)
			const fullpath = path.join(outputCwd, optimization?.relativePath ?? '')

			callback({
				data: getPreviewImage(fullpath),
			});
		},
		listOptimization(callback: (res: Response<AssetOptimizerOptimization[]>) => void) {
			callback({
				data: components['optimizationRepository'].findAll(),
			});
		},
	};
}
