import { ServerOptions } from 'socket.io';
import { AssetOptimizerFile, AssetOptimizerOptimization, AssetOptimizerRule, AssetOptimizerUiRuleDef } from '../../types';

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
	'file:list': (callback: (res: Response<AssetOptimizerFile[]>) => void) => Promise<void>;
	'file:delete': (aoFile: AssetOptimizerFile) => void;
	'file:update': (aoFile: AssetOptimizerFile) => void;
	'file:create': (aoFile: Omit<AssetOptimizerFile, 'id'>) => Promise<void>;
	'file:upload': () => void; //@todo

	'rule:list': (callback: (res: Response<AssetOptimizerRule[]>) => void) => Promise<void>;
	'rule:delete': (rule: AssetOptimizerRule) => void;
	'rule:update': (rule: AssetOptimizerRule) => void;
	'rule:create': (rule: Omit<AssetOptimizerRule, 'id'>) => void;

	'optimization:list': (callback: (res: Response<AssetOptimizerOptimization[]>) => void) => Promise<void>;

	'ruledef:list': (callback: (res: Response<AssetOptimizerUiRuleDef[]>) => void) => Promise<void>;
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
};
