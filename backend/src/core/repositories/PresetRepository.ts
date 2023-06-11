import Repository, { IRepository } from './Repository';
import { AssetOptimizerPreset } from '../types';

export class PresetRepository extends Repository<AssetOptimizerPreset> implements IRepository<AssetOptimizerPreset> {}
