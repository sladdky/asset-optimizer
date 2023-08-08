import { applyPresetsToFileComposition } from '../compositions/applyPresetsToFileComposition';
import { FileRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import { AssetOptimizerPreset, AssetOptimizerPresetRule, AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

// preset deleted
// ----
// 1. if pattern changes, check for new rules that match the pattern and remove all that no longer match
//
export function watchPresetBeforeUpdateComposition({ ruleDefs, components }: Props) {
	return () => {
		components['presetRepository'].on('before-update', (preset: AssetOptimizerPreset) => {
			//@todo get previous version of rule object before update because find,findById will get already updated version...
			const oldPreset = {
				pattern: null,
			};

			if (preset.pattern === oldPreset?.pattern) {
				return preset;
			}

			const newAoFiles = components['fileRepository'].find({
				query: {
					relativePath: {
						$regex: new RegExp(`^${preset.pattern}$`, 'i'),
					},
				},
			});

			const oldRules = components['ruleRepository'].find({
				query: {
					presetRuleId: {
						$in: components['presetRuleRepository'].find({
							query: {
								presetId: {
									$eq: preset.id,
								},
							},
						}),
					},
				},
			});

			//add new rules
			const applyPresetsToFile = applyPresetsToFileComposition({ ruleDefs, components });
			newAoFiles.forEach((newAoFile) => {
				for (let index = oldRules.length - 1; index >= 0; index--) {
					if (oldRules[index].fileId === newAoFile.id) {
						oldRules.splice(index, 1);
					}
				}

				applyPresetsToFile(newAoFile);
			});
			components['ruleRepository'].deleteMany(oldRules);

			//@todo typescript force to return argument data => preset
			return preset;
		});
	};
}
