import Repository, { IRepository } from './Repository';
import { AssetOptimizerPresetRule } from '../types';

export class PresetRuleRepository extends Repository<AssetOptimizerPresetRule> implements IRepository<AssetOptimizerPresetRule> {}
