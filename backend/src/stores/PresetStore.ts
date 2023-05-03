import { GenericChangeEvent, Store } from './_Store';

type Preset = Record<string, string>;

type ChangeEvent = GenericChangeEvent<Preset>;

export class PresetStore extends Store<Preset> {
	emit(name: 'change', event: ChangeEvent): this;
	emit(name: string, event: Record<string, unknown>): this {
		return super.emit(name, event);
	}

	on(name: 'change', callback: (event: ChangeEvent) => void, ctx?: any): this;
	on(name: string, callback: (event: any) => void, ctx?: any) {
		return super.on(name, callback, ctx);
	}
}
