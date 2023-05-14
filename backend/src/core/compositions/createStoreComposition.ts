import { FileStore } from '../stores';
import path from 'path';
import fs from 'fs';

type Props = {
	cwd: string;
};

const STORES = {
	FileStore,
} as const;

export function createStoreComposition({ cwd }: Props) {
	const tempCwd = path.join(cwd, '/.temp');
	fs.mkdirSync(tempCwd, { recursive: true });

	return (name: keyof typeof STORES, filename: string) => {
		return new STORES[name](path.join(tempCwd, filename));
	};
}
