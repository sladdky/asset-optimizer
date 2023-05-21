import Repository, { IRepository } from './Repository';
import { AssetOptimizerRule } from '../types';

export class RuleRepository extends Repository<AssetOptimizerRule> implements IRepository<AssetOptimizerRule> {}
