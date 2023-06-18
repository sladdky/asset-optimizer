import { PresetRepository, PresetRuleRepository } from '../repositories';
import { AssetOptimizerRule } from '../types';

type Props = {
	components: {
		presetRuleRepository: PresetRuleRepository;
		presetRepository: PresetRepository;
	};
};

// preset deleted
// ----
// 1. delete presetrules for the preset
// 2. delete rules created by presetrule (will be handled by 'watchPresetRuleDelete')
//
export function watchPresetDeleteComposition({ components }: Props) {
	return () => {
		components['presetRepository'].on('delete', (preset: AssetOptimizerRule) => {
			components['presetRuleRepository'].find({
				query: {
					presetId: {
						$eq: preset.id,
					},
				},
			});
		});
	};
}
