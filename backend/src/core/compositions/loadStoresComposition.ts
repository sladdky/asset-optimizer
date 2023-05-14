import { FileStore } from '../stores/FileStore';

type Props = {
	fileStore: FileStore;
};

export function loadStoresComposition({ fileStore }: Props) {
	return async () => {
		await Promise.all([fileStore.load()]);
	};
}
