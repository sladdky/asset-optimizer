import { FileRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import { AssetOptimizerPresetRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		presetRepository: PresetRepository;
		ruleRepository: RuleRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

// presetrule created
// ----
// 1. create rule from this presetrule for matching files
//
export function watchPresetRuleCreateComposition({ ruleDefs, components }: Props) {
	return () => {
		components['presetRuleRepository'].on('create', (presetRule: AssetOptimizerPresetRule) => {
			const preset = components['presetRepository'].findById(presetRule.presetId);
			if (!preset) {
				//'Invalid presetId on presetrule. Couldnt find preset.'
				return;
			}

			const ruleDef = ruleDefs.find((ruleDef) => ruleDef.ruleName === presetRule.ruleName);
			if (!ruleDef) {
				//'Invalid ruleName on presetrule. Couldnt find ruleDef.'
				return;
			}

			const aoFiles = components['fileRepository'].find({
				query: {
					$and: [
						{
							relativePath: {
								$regex: `^${preset.pattern}$`,
							},
						},
						{
							ext: {
								$regex: ruleDef.ext,
							},
						},
					],
				},
			});

			aoFiles.forEach((aoFile) => {
				components['ruleRepository'].create({
					fileId: aoFile.id,
					relativePath: aoFile.relativePath,
					ruleName: presetRule.ruleName,
					presetRuleId: presetRule.id,
					data: presetRule.data,
				});
			});
		});
	};
}
