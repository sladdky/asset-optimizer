import { Collection } from 'lokijs';
import { IDatabase } from '../database';
import { TinyEmitter } from 'tiny-emitter';

export interface FindOptions {
	query: Parameters<Collection['find']>[0];
}

export interface FindOneOptions {
	query: Parameters<Collection['findOne']>[0];
}

export interface RemoveOptions {
	query: Parameters<Collection['find']>[0];
}

export interface IRepository<T = IEntity> {
	update(entity: T): Promise<boolean>;
	create(entity: T): Promise<T | undefined>;
	remove(options: RemoveOptions): Promise<boolean>;
	removeById(id: ID): Promise<boolean>;
	findById(id: ID): Promise<T>;
	find(options: FindOptions): Promise<T[]>;
	findAll(): Promise<T[]>;
	findOne(options: FindOneOptions): Promise<T | null>;
}

export type IFilter<T> = Partial<Record<keyof T, (item: T) => boolean>>;

export type ID = number;

export type IEntity = {
	id: ID;
};

export default class Repository<T extends IEntity> extends TinyEmitter implements IRepository<T> {
	private readonly collection: Collection<T>;

	constructor(db: IDatabase, collectionName: string) {
		super();
		this.collection = db.getCollection(collectionName);

		this.collection.on('delete', (event) => this.emit('delete', event));
		this.collection.on('update', (event) => this.emit('update', event));
		this.collection.on('insert', (event) => this.emit('create', event));
	}

	public async findById(id: ID): Promise<T> {
		return this.collection.get(id);
	}

	public async findOne(options: FindOneOptions): Promise<T | null> {
		return this.collection.findOne(options.query);
	}

	public async find(options: FindOptions): Promise<T[]> {
		return this.collection.find(options.query);
	}

	public async findAll(): Promise<T[]> {
		return this.collection.find();
	}

	public async create(entity: Omit<T, 'id'>): Promise<T | undefined> {
		const _entity: T = {
			id: this.collection.maxId + 1,
			...entity,
		} as unknown as T;
		return this.collection.insertOne(_entity);
	}

	public async remove(options: RemoveOptions): Promise<boolean> {
		this.collection.remove(this.collection.find(options.query));
		return true;
	}

	public async update(entity: T): Promise<boolean> {
		this.collection.update(entity);
		return true;
	}

	public async removeById(id: ID): Promise<boolean> {
		this.collection;
		this.collection.removeWhere({
			$loki: {
				$eq: id,
			},
		});
		return true;
	}
}
