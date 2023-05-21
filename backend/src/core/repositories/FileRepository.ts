import Repository, { IRepository } from './Repository';
import { AssetOptimizerFile } from '../types';

export class FileRepository extends Repository<AssetOptimizerFile> implements IRepository<AssetOptimizerFile> {}
