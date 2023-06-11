import LokiJS, { Collection } from 'lokijs';
import path from 'path';

type DatabaseOptions = {
	cwd: string;
	dbName: string;
	autosave?: boolean;
};

export type IDatabase = {
	load: () => Promise<void>;
	save: () => Promise<void>;
	getCollection: (collectionName: string) => Collection;
	removeCollection: (collectionName: string) => void;
};

export default class Database implements IDatabase {
	private readonly loki: LokiJS;
	private readonly options: DatabaseOptions;
	private isLoaded: boolean;
	private loadPromise: Promise<void> | null;

	constructor(options: DatabaseOptions) {
		this.options = {
			autosave: false,
			...options,
		};

		this.loki = new LokiJS(path.join(options.cwd, `${options.dbName}.json`), {
			autosave: options.autosave,
		});

		this.isLoaded = false;
		this.loadPromise = null;
	}

	getCollection(collectionName: string) {
		return this.loki.getCollection(collectionName) || this.loki.addCollection(collectionName);
	}

	removeCollection(collectionName: string) {
		this.loki.removeCollection(collectionName);
	}

	load() {
		if (this.loadPromise) {
			return this.loadPromise;
		}

		if (this.isLoaded) {
			return Promise.resolve();
		}

		this.loadPromise = new Promise<void>((resolve, reject) => {
			this.loki.loadDatabase({}, (error) => {
				if (error) {
					console.log(error);
				} else {
					this.isLoaded = true;
					resolve();
				}
			});
		});

		return this.loadPromise;
	}

	save = () => {
		return new Promise<void>((resolve, reject) => {
			this.loki.saveDatabase(() => {
				resolve();
			});
		});
	};
}
