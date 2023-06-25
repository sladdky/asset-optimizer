import { OptimizationRepository } from '../../core/repositories';
import { AssetOptimizerOptimization, DownloadInfo, Response } from '../../types';
import path from 'path';
import { getPreviewImage } from '../common/getPreviewImage';
import { createArchiveFromFiles } from '../common';

type Props = {
	outputCwd: string;
	tempCwd: string;
	components: {
		optimizationRepository: OptimizationRepository;
	};
};

export function createOptimizationHandlers({ outputCwd, tempCwd, components }: Props) {
	return {
		async downloadManyOptimization(ids: number[], callback: (res: Response<DownloadInfo>) => void) {
			const aoFiles = components['optimizationRepository'].find({
				query: {
					id: {
						$in: ids,
					},
				},
			});

			const relativePaths = aoFiles.map((aoFile) => aoFile.relativePath);

			const archive = await createArchiveFromFiles(relativePaths, {
				cwd: outputCwd,
				tempCwd,
			});

			callback({
				data: {
					url: archive.url,
					size: 0,
				},
			});

			//.then((archive) => {
			// 	callback({
			// 		data: {
			// 			url: archive.url,
			// 			size: archive.size,
			// 		},
			// 	});
			// });
		},
		previewImageOptimization(id: number, callback: (res: Response<string>) => void) {
			const optimization = components['optimizationRepository'].findById(id);
			const fullpath = path.join(outputCwd, optimization?.relativePath ?? '');

			callback({
				data: getPreviewImage(fullpath),
			});
		},
		listOptimization(callback: (res: Response<AssetOptimizerOptimization[]>) => void) {
			callback({
				data: components['optimizationRepository'].findAll(),
			});
		},
	};
}
