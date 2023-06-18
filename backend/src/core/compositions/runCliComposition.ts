import { PresetRepository, PresetRuleRepository } from '../repositories';
import { AssetOptimizerRuleDef } from '../types';

type Props = {
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
	};
};

export function runCliComposition({ components }: Props) {
	return () => {
		if (process.env.cli) {
			if (!components['presetRepository'].findById(1)) {
				const preset = components['presetRepository'].create({
					pattern: '.*',
				});
				if (preset) {
					components['presetRuleRepository'].create({
						presetId: preset.id,
						ruleName: 'svgAuto',
					});
					components['presetRuleRepository'].create({
						presetId: preset.id,
						ruleName: 'imageAuto',
					});
					components['presetRuleRepository'].create({
						presetId: preset.id,
						ruleName: 'videoAuto',
					});
				}
			}
		}
	};
}
