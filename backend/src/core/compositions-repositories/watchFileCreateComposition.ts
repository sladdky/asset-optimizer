import { applyPresetsToFileComposition } from '../compositions/applyPresetsToFileComposition'
import { FileRepository, RuleRepository, PresetRepository, PresetRuleRepository } from '../repositories';
import { AssetOptimizerFile, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		presetRepository: PresetRepository;
		ruleRepository: RuleRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

// file created
// ----
// 1. find all presets that match filename regex and create rules for them
//
export function watchFileCreateComposition({ ruleDefs, components }: Props) {
    return () => {
        const applyPresetsToFile = applyPresetsToFileComposition({ruleDefs, components})

        components['fileRepository'].on('create', (aoFile: AssetOptimizerFile) => {
            applyPresetsToFile(aoFile)
		});
	};
}
