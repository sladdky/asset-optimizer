import { Store } from './_Store';

type Preset = Record<string, string>;

export class PresetStore extends Store<Preset> {}
