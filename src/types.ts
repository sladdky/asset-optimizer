export type AssetOptimizerStructure = Record<string, AssetOptimizerFile>;
export type AssetOptimizerFile = {
	modified: number;
	isDir: boolean;
	optimized?: boolean;
	[key: string]: any;
};
export type AssetOptimizerRuleArgument = {
	relativePath: string;
	cwd: string;
	outputCwd: string;
	additionalData?: Record<string, any>;
};
export type AssetOptimizerRuleCallbackFnc = (arg: AssetOptimizerRuleArgument) => void;
export type AssetOptimizerRule = {
	callback: AssetOptimizerRuleCallbackFnc;
};
export type AssetOptimizerRules = Record<string, AssetOptimizerRule>;
export type AssetOptimizerConfig = {
	inputCwd: string;
	outputCwd: string;
	tempCwd: string;
	rules: AssetOptimizerRules;
};
export type AssetOptimizerOptimizeFileOptions = {
	cwd: string;
	outputCwd: string;
	rules: AssetOptimizerRules;
	additionalData?: Record<string, any>;
};

export type AssetOptimizerStoreConfig = {
	cwd: string;
	filePath: string;
};
export type AssetOptimizerStore = {
	getStructure: () => AssetOptimizerStructure;
	setStructure: (structure: AssetOptimizerStructure) => void;
	save: () => void;
	initialize: () => Promise<void>;
};

export type AssetOptimizerExpressApp = {
	start: () => void;
};
