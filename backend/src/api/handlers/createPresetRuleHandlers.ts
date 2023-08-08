import { PresetRuleRepository } from '../../core/repositories';
import { log } from '../../logger'
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
			const newPresetRule = components['presetRuleRepository'].findById(presetRule.id)
			if (!newPresetRule) {
				log('CORE', `Trying to update non-existing presetRule with id: ${presetRule.id}`)
				return
			}
			newPresetRule.data = presetRule.data
			components['presetRuleRepository'].update(newPresetRule);
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
