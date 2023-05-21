import { AssetOptimizerCoreConfig, AssetOptimizerRuleDef } from './types';
import { copyCallback, imageCallback, svgCallback, videoCallback } from './rules';
import { FileRepository, OptimizationRepository, RuleRepository } from './repositories';
import { watchFsFilesComposition } from './compositions/watchFsFilesComposition';
import { scanFsFilesComposition } from './compositions/scanFsFilesComposition';
import { watchForOptimizationComposition } from './compositions/watchForOptimizationComposition';

type Props = {
	config: Pick<AssetOptimizerCoreConfig, 'inputCwd' | 'outputCwd'> & Partial<AssetOptimizerCoreConfig>;
	components: {
		fileRepository: FileRepository;
		optimizationRepository: OptimizationRepository;
		ruleRepository: RuleRepository;
	};
};

export function coreComposition({ config, components }: Props) {
	const ruleDefs: AssetOptimizerRuleDef[] = [];

	const addRuleDef = (ruleDef: AssetOptimizerRuleDef) => {
		if (ruleDefs.find((_ruleDef) => _ruleDef.name === ruleDef.name)) {
			throw new Error(`Rule '${ruleDef.name} already exists.`);
		}

		ruleDefs.push(ruleDef);
	};

	addRuleDef({
		name: 'image',
		displayName: 'auto',
		ext: 'jpg|jpeg|png',
		callback: imageCallback,
	});

	// addRuleDef({
	// 	name: 'crop',
	// 	displayName: 'crop',
	// 	ext: 'jpg|jpeg|png|tiff',
	// 	callback: imageCallback,
	// });

	addRuleDef({
		name: 'video',
		displayName: 'auto',
		ext: 'mov|mp4',
		callback: videoCallback,
	});

	// addRuleDef({
	// 	name: 'video-crop',
	// 	displayName: 'crop',
	// 	ext: 'mov|mp4',
	// 	callback: videoCallback,
	// });

	addRuleDef({
		name: 'svg',
		displayName: 'auto',
		ext: 'svg',
		callback: svgCallback,
	});

	addRuleDef({
		name: 'copy',
		displayName: 'copy',
		ext: '',
		callback: copyCallback,
	});

	return {
		start: async () => {
			console.log('1/3 CORE:Scanning filesystem...');
			const scanFsFiles = scanFsFilesComposition({
				cwd: config.inputCwd,
				components,
			});
			await scanFsFiles();

			console.log('2/3 CORE:Watching for changes in filesystem...');
			const watchFsFiles = watchFsFilesComposition({
				cwd: config.inputCwd,
				components,
			});
			await watchFsFiles();

			console.log('3/3 CORE:Watching for optimization requests...');
			const watchForOptimization = watchForOptimizationComposition({
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
				ruleDefs,
				components,
			});
			await watchForOptimization();

			// console.log('3/4 CORE:Synchronizing files to store...');
			// const syncFiles = syncFilesComposition({
			// 	cwd: config.inputCwd,
			// 	components,
			// });
			// syncFiles();
		},
		addRuleDef,
		getRuleDefs() {
			return ruleDefs;
		},
	};
}
