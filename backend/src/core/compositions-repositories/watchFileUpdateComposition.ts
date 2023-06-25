import { FileRepository, RuleRepository } from '../repositories';

type Props = {
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
	};
};

// file updated
// ----
// CASE 1 - file renamed
// 1. update paths on rules and optimizations
// 2. check if presetrules are still valid or some needs to be deleted/created
//
export function watchFileUpdateComposition({ components }: Props) {
	return () => {};
}
