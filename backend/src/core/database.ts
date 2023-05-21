import LokiJS, { Collection } from 'lokijs';
import path from 'path';

type DatabaseOptions = {
	cwd: string;
	dbName: string;
};

export type IDatabase = {
	load: () => void;
	save: () => void;
	getCollection: (collectionName: string) => Collection;
};

export default class Database implements IDatabase {
	private readonly loki: LokiJS;

	constructor(options: DatabaseOptions) {
		this.loki = new LokiJS(path.join(options.cwd, `${options.dbName}.json`), {
			autosave: true,
		});
	}

	getCollection(collectionName: string) {
		return this.loki.getCollection(collectionName) || this.loki.addCollection(collectionName, { autoupdate: true });
	}

	load() {
		this.loki.loadDatabase();
	}

	save = () => {
		this.loki.saveDatabase();
	};
}
