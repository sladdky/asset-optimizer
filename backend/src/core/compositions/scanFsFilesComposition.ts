import { getAoFiles } from '../common/getAoFiles';
import { FileRepository } from '../repositories';

type Props = {
	cwd: string;
	components: {
		fileRepository: FileRepository;
	};
};

export function scanFsFilesComposition({ cwd, components }: Props) {
	return () => {
		const aoFiles = getAoFiles('', {
			cwd,
			ignoredPaths: ['.temp'],
		});

		for (const relativePath in aoFiles) {
			const aoFile = aoFiles[relativePath];

			components['fileRepository'].create(aoFile);
		}
	};
}
