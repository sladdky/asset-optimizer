import { AssetOptimizerConfig } from './types'
import { DEFAULT_CONFIG } from './common/DEFAULT_CONFIG'
import { FileStore } from './stores/FileStore'
import { PresetStore } from './stores/PresetStore'
import { syncFilesComposition } from './compositions/syncFilesComposition'
import { watchStoreFilesForOptimizationComposition } from './compositions/watchStoreFilesForOptimizationComposition'
import { watchFsFilesComposition } from './compositions/watchFsFilesComposition'
import { loadStoresComposition } from './compositions/loadStoresComposition'

export function createAssetOptimizer(customConfig: Partial<AssetOptimizerConfig> = {}) {
	const config = {
		...DEFAULT_CONFIG,
		...customConfig,
	}

	const fileStore = new FileStore('files.json')
	const presetStore = new PresetStore('presets.json')

	const watch = async () => {
		console.log('1/5 Loading stores...')
		const loadStores = loadStoresComposition({
			fileStore,
			presetStore,
		})
		await loadStores()

		console.log('2/5 Watching for optimization requests...')
		const watchForOptimization = watchStoreFilesForOptimizationComposition({
			fileStore,
			cwd: config.cwd,
			outputCwd: config.outputCwd,
			rules: config.rules,
		})
		await watchForOptimization()

		console.log('3/5 Synchronizing files to store...')
		const syncFiles = syncFilesComposition({ fileStore, cwd: config.cwd })
		syncFiles()

		console.log('4/5 Watching for changes in filesystem...')
		const watchFs = watchFsFilesComposition({
			fileStore,
			cwd: config.cwd,
		})
		watchFs()

		// presetStore.on('change', () => {
		// 	optimizeFiles()
		// })

		// console.log('Starting UI... http://localhost:3002')
		// expressApp.start()
	}

	return {
		watch,
	}
}
