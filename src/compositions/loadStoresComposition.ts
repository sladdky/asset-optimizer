import { FileStore } from '../stores/FileStore';
import { PresetStore } from '../stores/PresetStore';

type Props = {
	fileStore: FileStore;
	presetStore: PresetStore;
};

export function loadStoresComposition({ fileStore, presetStore }: Props) {
	return async () => {
		await Promise.all([fileStore.load(), presetStore.load()]);
	};
}
