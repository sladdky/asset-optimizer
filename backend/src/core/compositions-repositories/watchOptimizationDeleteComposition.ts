import { OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerOptimization } from '../types';
import fs from 'fs';
import path from 'path';

type Props = {
	outputCwd: string;
	components: {
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
	};
};

// optimization deleted
// ----
// 1. delete file in filesystem
//
export function watchOptimizationDeleteComposition({ outputCwd, components }: Props) {
	return () => {
		components['optimizationRepository'].on('delete', (optimization: AssetOptimizerOptimization) => {
			const filename = path.join(outputCwd, optimization.relativePath);
			fs.rmSync(filename);
		});
	};
}
