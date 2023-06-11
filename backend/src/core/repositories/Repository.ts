import { Collection } from 'lokijs';
import { IDatabase } from '../database';
import { Emitter } from '../../_plugins/emitter';

interface FindOptions<T extends object> {
	query: Parameters<Collection<T>['find']>[0];
}

interface FindOneOptions<T extends object> {
	query: Parameters<Collection<T>['findOne']>[0];
}

interface DeleteOptions<T extends object> {
	query: Parameters<Collection<T>['find']>[0];
}

export interface IRepository<T extends object = IEntity> {
	update(entity: T): boolean;
	updateMany(entity: T[]): boolean;
	create(entity: T): T | undefined;
	createMany(entity: T[]): T[] | undefined;
	delete(entity: T): boolean;
	deleteMany(entity: T[]): boolean;
	deleteById(id: ID): boolean;
	deleteWhere(options: FindOptions<T>): boolean;
	find(options: FindOptions<T>): T[];
	findOne(options: FindOneOptions<T>): T | null;
	findById(id: ID): T | null;
	findAll(): T[];
}

export type IFilter<T> = Partial<Record<keyof T, (item: T) => boolean>>;

export type ID = number;

export type IEntity = {
	id: ID;
};

export default class Repository<T extends IEntity> extends Emitter implements IRepository<T> {
	private collection: Collection<T>;

	constructor(db: IDatabase, collectionName: string) {
		super();

		//HACK!!! - loading lokijs is "async"
		//call await db.load(), before using the repository methods in the app
		//any action before load will be saved to temp and removed

		this.collection = db.getCollection(`__temp-${collectionName}`);
		db.load().then(() => {
			db.removeCollection(`__temp-${collectionName}`);
			this.collection = db.getCollection(collectionName);
			this.collection.on('delete', (event) => this.emit('delete', event));
			this.collection.on('update', (event) => this.emit('update', event));
			this.collection.on('insert', (event) => {
				this.emit('create', event);
			});
		});
	}

	public find(options: FindOptions<T>): T[] {
		return this.collection.find(options.query);
	}

	public findOne(options: FindOneOptions<T>): T | null {
		return this.collection.findOne(options.query);
	}

	public findById(id: ID): T | null {
		return this.collection.get(id);
	}

	public findAll(): T[] {
		return this.collection.find();
	}

	public create(entity: Omit<T, 'id'>): T | undefined {
		let newEntity: T = {
			id: this.collection.maxId + 1,
			...entity,
		} as unknown as T;
		newEntity = this.emit('before-create', newEntity);
		return this.collection.insertOne(newEntity);
	}

	public createMany(entities: Omit<T, 'id'>[]): T[] | undefined {
		const newEntities: T[] = [];
		let id = this.collection.maxId + 1;
		entities.forEach((entity) => {
			const newEntity: T = {
				id,
				...entity,
			} as unknown as T;
			id += 1;
			newEntities.push(this.emit('before-create', newEntity));
		});
		return this.collection.insert(newEntities);
	}

	public update(entity: T): boolean {
		entity = this.emit('before-update', entity);
		try {
			this.collection.update(entity);
		} catch (error) {
			console.log('Couldnt update document that is not in collection.');
		}
		return true;
	}

	public updateMany(entities: T[]): boolean {
		const updatedEntities: T[] = [];
		entities.forEach((entity) => {
			entity = this.emit('before-update', entity);
			updatedEntities.push(this.emit('before-update', entity));
		});
		this.collection.update(updatedEntities);
		return true;
	}

	public delete(entity: T): boolean {
		this.collection.remove(entity);
		return true;
	}

	public deleteMany(entity: T[]): boolean {
		this.collection.remove(entity);
		return true;
	}

	public deleteWhere(options: DeleteOptions<T>): boolean {
		this.collection.findAndRemove(options.query);
		return true;
	}

	public deleteById(id: ID): boolean {
		this.collection;
		this.collection.removeWhere({
			$loki: {
				$eq: id,
			},
		});
		return true;
	}
}
