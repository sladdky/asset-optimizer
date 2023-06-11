import { PresetRepository } from '../../core/repositories';
import { AssetOptimizerPreset, Response } from '../../types';

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
		updatePreset(preset: AssetOptimizerPreset) {
			return components['presetRepository'].update(preset);
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
