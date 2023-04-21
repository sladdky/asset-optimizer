import { AssetOptimizerFile } from '../types'
import { DefaultEmitProps, Store, EMITS as STORE_EMITS } from './_Store'

export const EMITS = {
	...STORE_EMITS,
	NEEDS_OPTIMIZATION: '',
}

export type EmitsChangeProps = DefaultEmitProps<AssetOptimizerFile>
export type EmitsNeedsOptimizationProps = DefaultEmitProps<AssetOptimizerFile>

export class FileStore extends Store<AssetOptimizerFile> {
	set(key: string, value: AssetOptimizerFile) {
		super.set(key, value)

		this.check(key)
	}

	check(key: string) {
		const value = this.get(key)
		if (value && !value.optimized) {
			this.emit(EMITS.NEEDS_OPTIMIZATION, {
				key,
				value,
			})
		}
	}
	//@todo watch for changes in props and fire 'needs-optimization' if optimized = false
}
