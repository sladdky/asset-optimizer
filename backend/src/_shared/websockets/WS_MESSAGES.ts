import { AssetOptimizerFile } from '../types';

export type WS_MESSAGES = {
	'request:filestore': {
		name: 'request:filestore';
		data?: any;
	};
	'request:filestore-itemupdate': {
		name: 'request:filestore-itemupdate';
		data: {
			key: string;
			value: AssetOptimizerFile;
		};
	};
	filestore: {
		name: 'filestore';
		data: {
			items: Record<string, AssetOptimizerFile>;
		};
	};
	'filestore-itemchanged': {
		name: 'filestore-itemchanged';
		data: {
			key: string;
			value: AssetOptimizerFile;
		};
	};
};

export type WS_MESSAGE = {
	name: WS_MESSAGE_NAMES;
	data: any;
};
export type WS_MESSAGE_NAMES = keyof WS_MESSAGES;
export type WS_MESSAGE_VALUES = WS_MESSAGES[keyof WS_MESSAGES];
export type WS_MESSAGE_CALLBACKS = Partial<{
	[key in keyof WS_MESSAGES]: (data: WS_MESSAGES[key]['data']) => void;
}>;