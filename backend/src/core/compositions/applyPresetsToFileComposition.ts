import { PresetRepository, PresetRuleRepository, RuleRepository } from "../repositories"
import { AssetOptimizerFile, AssetOptimizerRuleDef } from "../types"

type Props = {
    ruleDefs: AssetOptimizerRuleDef[],
	components: {
		presetRepository: PresetRepository;
        presetRuleRepository: PresetRuleRepository;
        ruleRepository: RuleRepository;
	};
};

export function applyPresetsToFileComposition({ ruleDefs, components}: Props) {
    return (aoFile: AssetOptimizerFile) => {
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
    }
}