import { PresetRepository, PresetRuleRepository } from '../../core/repositories';
import { AssetOptimizerPresetRule } from '../../types';

type Props = {
	components: {
		presetRuleRepository: PresetRuleRepository;
		presetRepository: PresetRepository;
	};
};

export function createOtherHandlers({ components }: Props) {
	return {
		createPresetDefaultsOther() {
			const patterns: Record<string, Omit<AssetOptimizerPresetRule, 'id' | 'presetId'>[]> = {
				'.*(jpe?g|png)': [
					{
						ruleName: 'imageAuto',
						data: {},
					},
				],
				'.*(mp4|mkv|avi|mov)': [
					{
						ruleName: 'videoAuto',
						data: {},
					},
				],
				'.*(svg)': [
					{
						ruleName: 'svgAuto',
						data: {},
					},
				],
				'.*(zip|pdf|woff|woff2)': [
					{
						ruleName: 'copy',
						data: {},
					},
				],
			};

			for (const pattern in patterns) {
				const presetRules = patterns[pattern];
				const preset = components['presetRepository'].create({
					pattern,
				});
				if (!preset) {
					continue;
				}
				presetRules.forEach((presetRule) => {
					components['presetRuleRepository'].create({
						...presetRule,
						presetId: preset.id,
					});
				});
			}
		},
	};
}
