import { AssetOptimizerOptimizeFileOptions } from '../../../_shared/types';
import path from 'path';

export async function optimizeFile(relativePath: string, options: AssetOptimizerOptimizeFileOptions) {
	const srcPath = path.join(options.inputCwd, relativePath);
	const ext = path.extname(srcPath);
	if (!ext) {
		return;
	}

	for (const key in options.rules) {
		if (ext.toLowerCase().match(new RegExp(key))) {
			const callback = options.rules[key].callback;

			console.log(`Optimizing: ${srcPath}. Rule: ${key}`);
			await callback({
				relativePath,
				inputCwd: options.inputCwd,
				outputCwd: options.outputCwd,
				additionalData: options.additionalData,
			});

			return true;
		}
	}

	console.log(`Rule not found for: '${relativePath}'`);
	return false;
}