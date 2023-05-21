import { IEntity } from '../repositories/Repository';

export type AssetOptimizerFileMap = Record<string, Omit<AssetOptimizerFile, 'id'>>;
export type AssetOptimizerFile = {
	ext: string;
	relativePath: string;
	modified: number;
	isDir: boolean;
	[key: string]: any;
} & IEntity;

export type AssetOptimizerRuleProps<TData = any> = {
	relativePath: string;
	inputCwd: string;
	outputCwd: string;
	data?: TData;
};
export type AssetOptimizerRuleDefCallbackMeta = {
	optimizations: Omit<AssetOptimizerOptimization, 'id' | 'ruleId'>[];
};

export type AssetOptimizerRuleDefMap = Record<string, AssetOptimizerRuleDef>;
export type AssetOptimizerRuleDef = {
	name: string;
	displayName: string;
	ext: string;
	callback: (props: AssetOptimizerRuleProps) => Promise<AssetOptimizerRuleDefCallbackMeta>;
};
export type AssetOptimizerUiRuleDef = Omit<AssetOptimizerRuleDef, 'callback'> & {
	component?: string;
};

export type AssetOptimizerCoreConfig = {
	inputCwd: string;
	outputCwd: string;
};

export type AssetOptimizerRegisteredRuleMap = {
	'image-optimize': AssetOptimizerRuleDef;
	'image-resize-and-optimize': AssetOptimizerRuleDef;
	'video-optimize': AssetOptimizerRuleDef;
	'video-resize-and-optimize': AssetOptimizerRuleDef;
	'svg-optimize': AssetOptimizerRuleDef;
	copy: AssetOptimizerRuleDef;
};

export type AssetOptimizerOptimization = {
	ruleId: number;
	relativePath: string;
} & IEntity;

export type AssetOptimizerRule = {
	fileId: number;
	fileRelativePath: string;
	ruleDefName: string;
	data?: Record<string, any>;
	state?: string;
} & IEntity;
