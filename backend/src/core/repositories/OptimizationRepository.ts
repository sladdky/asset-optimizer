import Repository, { IRepository } from './Repository';
import { AssetOptimizerOptimization } from '../types';

export class OptimizationRepository extends Repository<AssetOptimizerOptimization> implements IRepository<AssetOptimizerOptimization> {}
