import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import {
	watchFileCreateComposition,
	watchFileDeleteComposition,
	watchFileUpdateComposition,
	watchOptimizationDeleteComposition,
	watchPresetDeleteComposition,
	watchPresetRuleCreateComposition,
	watchPresetRuleDeleteComposition,
	watchPresetRuleUpdateComposition,
	watchRuleBeforeCreateComposition,
	watchRuleBeforeUpdateComposition,
	watchRuleDeleteComposition,
} from '../compositions-repositories';
import { AssetOptimizerRuleDef } from '../types';

type Props = {
	outputCwd: string;
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
		optimizationRepository: OptimizationRepository;
	};
};

//watch for changes in filesystem and update store accordingly
export function watchRepositoriesComposition({ outputCwd, ruleDefs, components }: Props) {
	return () => {
		const watchFileCreate = watchFileCreateComposition({ ruleDefs, components });
		watchFileCreate();
		const watchFileDelete = watchFileDeleteComposition({ components });
		watchFileDelete();
		const watchFileUpdate = watchFileUpdateComposition({ components });
		watchFileUpdate();
		const watchOptimizationDelete = watchOptimizationDeleteComposition({ outputCwd, components });
		watchOptimizationDelete();
		const watchPresetDelete = watchPresetDeleteComposition({ components });
		watchPresetDelete();
		const watchPresetRuleCreate = watchPresetRuleCreateComposition({ ruleDefs, components });
		watchPresetRuleCreate();
		const watchPresetRuleDelete = watchPresetRuleDeleteComposition({ components });
		watchPresetRuleDelete();
		const watchPresetRuleUpdate = watchPresetRuleUpdateComposition({ components });
		watchPresetRuleUpdate();
		const watchRuleBeforeCreate = watchRuleBeforeCreateComposition({ ruleDefs, components });
		watchRuleBeforeCreate();
		const watchRuleBefore = watchRuleBeforeUpdateComposition({ ruleDefs, components });
		watchRuleBefore();
		const watchRuleDelete = watchRuleDeleteComposition({ components });
		watchRuleDelete();
	};
}
