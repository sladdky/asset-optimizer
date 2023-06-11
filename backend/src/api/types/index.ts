import { ServerOptions } from 'socket.io';
import {
	AssetOptimizerFile,
	AssetOptimizerOptimization,
	AssetOptimizerPreset,
	AssetOptimizerPresetRule,
	AssetOptimizerRule,
	AssetOptimizerRuleDef,
} from '../../types';

interface Error {
	error: string;
}

interface Success<T> {
	data: T;
}

export type Response<T> = Error | Success<T>;

export type AssetOptimizerApiConfig = {
	port: number;
	socketOptions?: Partial<ServerOptions>;
};

export type AssetOptimizerApiClientEvents = {
	'file:list': (callback: (res: Response<AssetOptimizerFile[]>) => void) => void;
	'file:delete': (id: number) => void;
	'file:update': (aoFile: AssetOptimizerFile) => void;
	'file:create': (aoFile: Omit<AssetOptimizerFile, 'id'>) => Promise<void>;
	'file:upload': () => void; //@todo

	'rule:list': (callback: (res: Response<AssetOptimizerRule[]>) => void) => void;
	'rule:delete': (id: number) => void;
	'rule:update': (rule: AssetOptimizerRule) => void;
	'rule:create': (rule: Omit<AssetOptimizerRule, 'id'>) => void;
	'rule:reset': (id: number) => void;

	'preset:list': (callback: (res: Response<AssetOptimizerPreset[]>) => void) => void;
	'preset:delete': (id: number) => void;
	'preset:update': (preset: AssetOptimizerPreset) => void;
	'preset:create': (preset: Omit<AssetOptimizerPreset, 'id'>) => void;

	'presetrule:list': (callback: (res: Response<AssetOptimizerPresetRule[]>) => void) => void;
	'presetrule:delete': (id: number) => void;
	'presetrule:update': (presetRule: AssetOptimizerPresetRule) => void;
	'presetrule:create': (presetRule: Omit<AssetOptimizerPresetRule, 'id'>) => void;

	'optimization:list': (callback: (res: Response<AssetOptimizerOptimization[]>) => void) => void;

	'ruledef:list': (callback: (res: Response<AssetOptimizerRuleDef[]>) => void) => void;
};

export type AssetOptimizerApiServerEvents = {
	'file:created': (aoFile: AssetOptimizerFile) => void;
	'file:updated': (aoFile: AssetOptimizerFile) => void;
	'file:deleted': (aoFile: AssetOptimizerFile) => void;

	'rule:created': (rule: AssetOptimizerRule) => void;
	'rule:updated': (rule: AssetOptimizerRule) => void;
	'rule:deleted': (rule: AssetOptimizerRule) => void;

	'optimization:created': (optimization: AssetOptimizerOptimization) => void;
	'optimization:updated': (optimization: AssetOptimizerOptimization) => void;
	'optimization:deleted': (optimization: AssetOptimizerOptimization) => void;

	'preset:created': (preset: AssetOptimizerPreset) => void;
	'preset:updated': (preset: AssetOptimizerPreset) => void;
	'preset:deleted': (preset: AssetOptimizerPreset) => void;

	'presetrule:created': (presetRule: AssetOptimizerPresetRule) => void;
	'presetrule:updated': (presetRule: AssetOptimizerPresetRule) => void;
	'presetrule:deleted': (presetRule: AssetOptimizerPresetRule) => void;
};
