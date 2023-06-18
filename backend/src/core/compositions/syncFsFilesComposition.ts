import { getAoFiles } from '../common/getAoFiles';
import { FileRepository, RuleRepository } from '../repositories';

type Props = {
	cwd: string;
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
	};
};

export function syncFsFilesComposition({ cwd, components }: Props) {
	return () => {
		const fsAoFiles = getAoFiles('', {
			cwd,
			ignoredPaths: ['.ao-data'],
		});

		const aoFiles = components['fileRepository'].findAll();

		for (const relativePath in fsAoFiles) {
			const fsAoFile = fsAoFiles[relativePath];

			const index = aoFiles.findIndex((aoFile) => aoFile.relativePath === relativePath);
			if (index < 0) {
				components['fileRepository'].create(fsAoFile);
				//@todo: maybe apply presets here? -> watchPresetComposition.ts
				continue;
			}

			const aoFile = aoFiles[index];
			if (aoFile.modified !== fsAoFile.modified) {
				const rules = components['ruleRepository'].find({
					query: {
						fileId: {
							$eq: aoFile.id,
						},
					},
				});

				rules.forEach((rule) => {
					rule.state = '';
					components['ruleRepository'].update(rule);
				});
			}

			aoFiles.splice(index, 1);
		}

		components['fileRepository'].deleteMany(aoFiles);

		//@todo remove rules and optimizations that have no file associated to it?

		//@todo remove optimization that has no associated file and force rule optimization again?
	};
}
