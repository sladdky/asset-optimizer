import { join } from 'path';
import { createAssetOptimizer } from '../src';

const ao = createAssetOptimizer({
	core: {
		inputCwd: join(__dirname, 'src'),
		outputCwd: join(__dirname, 'public'),
	},
});

ao.watch({
	ui: false,
});
