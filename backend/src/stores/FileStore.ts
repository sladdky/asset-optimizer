import { AssetOptimizerFile } from '../_shared/types';
import { GenericChangeEvent, Store } from './_Store';

type NeedsOptimizationEvent = {
	key: string;
	value: AssetOptimizerFile;
};

type ChangeEvent = GenericChangeEvent<AssetOptimizerFile>;

export class FileStore extends Store<AssetOptimizerFile> {
	set(key: string, value: AssetOptimizerFile) {
		super.set(key, value);
		this.check(key);
	}

	check(key: string) {
		const value = this.get(key);
		if (value && !value.optimized) {
			this.emit('needs-optimization', {
				key,
				value,
			});
		}
	}

	emit(name: 'needs-optimization', event: NeedsOptimizationEvent): this;
	emit(name: 'change', event: ChangeEvent): this;
	emit(name: string, event: Record<string, unknown>): this {
		return super.emit(name, event);
	}

	on(name: 'needs-optimization', callback: (event: NeedsOptimizationEvent) => void, ctx?: any): this;
	on(name: 'change', callback: (event: ChangeEvent) => void, ctx?: any): this;
	on(name: string, callback: (event: any) => void, ctx?: any) {
		return super.on(name, callback, ctx);
	}
}
