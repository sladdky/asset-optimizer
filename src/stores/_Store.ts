import throttle from 'lodash/throttle'
import fs from 'fs/promises'
import { Schema } from 'yup'
import { TinyEmitter } from 'tiny-emitter'

type Options<TSchema = Schema> = {
	schema?: Schema & TSchema
}

export const EMITS = {
	CHANGE: 'change',
}

export type DefaultEmitProps<TValue extends Record<string, any>> = {
	key: string
	value: Record<string, TValue>
}

export class Store<TValue extends Record<string, any>, TSchema extends Schema = any> extends TinyEmitter {
	_state: Record<string, TValue> //@todo typeof Proxy...
	filePath: string
	options: Options<TSchema>

	constructor(filePath: string, options: Partial<Options<TSchema>> = {}) {
		super()

		this.filePath = filePath
		this._state = {}
		this.options = options
	}

	async load() {
		try {
			const buffer = await fs.readFile(this.filePath)
			const state = JSON.parse(buffer.toString())
			this.setState(state)
		} catch (error) {}
	}

	setState(state: Record<string, TValue>) {
		if (this.options.schema) {
			for (const key in state) {
				state = this.options.schema.validateSync(state[key])
			}
		}

		this._state = state
	}

	saveImmediately() {
		return fs.writeFile(this.filePath, JSON.stringify(this._state, null, 2))
	}

	save = throttle(this.saveImmediately, 2000)

	getAll() {
		return this._state
	}

	get(key: string): TValue | undefined {
		return this._state[key]
	}

	set(key: string, value: TValue) {
		if (this.options.schema) {
			this.options.schema.validateSync(value)
		}

		this._state[key] = value
		this.emit(EMITS.CHANGE, {
			key,
			value,
		})
		this.save()
	}

	delete(key: string) {
		delete this._state[key]
		this.save()
	}
}
