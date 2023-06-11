import { PresetRuleRepository } from '../../core/repositories';
import { AssetOptimizerPresetRule, Response } from '../../types';

type Props = {
	components: {
		presetRuleRepository: PresetRuleRepository;
	};
};

export function createPresetRuleHandlers({ components }: Props) {
	return {
		deletePresetRule(id: number) {
			components['presetRuleRepository'].deleteById(id);
		},
		updatePresetRule(presetRule: AssetOptimizerPresetRule) {
			components['presetRuleRepository'].update(presetRule);
		},
		listPresetRule(callback: (res: Response<AssetOptimizerPresetRule[]>) => void) {
			callback({
				data: components['presetRuleRepository'].findAll(),
			});
		},
		createPresetRule(presetRule: Omit<AssetOptimizerPresetRule, 'id'>) {
			components['presetRuleRepository'].create(presetRule);
		},
	};
}
