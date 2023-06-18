import { FileRepository, RuleRepository } from '../repositories';
import { AssetOptimizerFile } from '../types';

type Props = {
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
	};
};

// file deleted
// ----
// 1. delete rules for the file
// 2. delete optimizations for the file (will be handled by 'watchRuleDelete')
//
export function watchFileDeleteComposition({ components }: Props) {
	return () => {
		components['fileRepository'].on('delete', (aoFile: AssetOptimizerFile) => {
			components['ruleRepository'].deleteWhere({
				query: {
					fileId: aoFile.id,
				},
			});
		});
	};
}
