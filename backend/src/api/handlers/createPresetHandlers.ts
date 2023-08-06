import { PresetRepository } from '../../core/repositories';
import { log } from '../../logger';
import { AssetOptimizerPreset, AssetOptimizerPresetRule, AssetOptimizerRuleDef, Response } from '../../types';

type Props = {
	components: {
		presetRepository: PresetRepository;
	};
};

export function createPresetHandlers({ components }: Props) {
	return {
		deletePreset(id: number) {
			return components['presetRepository'].deleteById(id);
		},
		renamePresetPattern(id: number, newPattern: string) {
			const preset = components['presetRepository'].findById(id);
			if (!preset) {
				log('API', 'Preset with id ${id} not found', 'warning');
				return;
			}
			const oldPreset = {...preset}
			preset.pattern = newPattern;
			return components['presetRepository'].update(preset, oldPreset);
		},
		listPreset(callback: (res: Response<AssetOptimizerPreset[]>) => void) {
			callback({
				data: components['presetRepository'].findAll(),
			});
		},
		createPreset(preset: Omit<AssetOptimizerPreset, 'id'>) {
			return components['presetRepository'].create(preset);
		},
	};
}
