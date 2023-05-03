import { join } from 'path';
import { createAssetOptimizer } from '../src';

const assetOptimizer = createAssetOptimizer({
	inputCwd: join(__dirname, 'public-src'),
	outputCwd: join(__dirname, 'public'),
});
assetOptimizer.watch();
