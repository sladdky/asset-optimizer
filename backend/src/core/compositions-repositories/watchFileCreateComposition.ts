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
		components['fileRepository'].on('create', (aoFile: AssetOptimizerFile) => {
			const presets = components['presetRepository'].findAll();

            const matchingPresets = presets.filter((preset) => aoFile.relativePath.match(preset.pattern));
            matchingPresets.forEach((preset) => {
                const presetRules = components['presetRuleRepository'].find({
                    query: {
                        presetId: preset.id,
                    },
                });

                presetRules.forEach((presetRule) => {
                    const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === presetRule.ruleName);
                    if (!ruleDef) {
                        // 'Invalid ruleName on presetrule. Couldnt find ruleDef.'
                        return;
                    }

                    if (!aoFile.ext.match(ruleDef.ext)) {
                        return;
                    }

                    components['ruleRepository'].create({
                        fileId: aoFile.id,
                        relativePath: aoFile.relativePath,
                        ruleName: presetRule.ruleName,
                        presetRuleId: presetRule.id,
                        data: presetRule.data,
                    });
                });
            });
		});
	};
}
