import { AssetOptimizerFile } from '../types';
import { DefaultEmitProps, Store } from './_Store';

export type EmitsChangeProps = DefaultEmitProps<AssetOptimizerFile>;
export type EmitsNeedsOptimizationProps = DefaultEmitProps<AssetOptimizerFile>;

export class FileStore extends Store<AssetOptimizerFile> {
	set(key: string, value: AssetOptimizerFile) {
		super.set(key, value);

		this.check(key);
	}

	check(key: string) {
		const value = this.get(key);
		if (value && !value.optimized) {
			this.emit('needs-optimization', { //@todo typescript autocomplete param overloading
				key,
				value,
			});
		}
	}
}
