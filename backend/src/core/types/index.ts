import { AssetOptimizerFile } from '../../_shared';

export type AssetOptimizerStructure = Record<string, AssetOptimizerFile>;

export type AssetOptimizerRuleArgument = {
	relativePath: string;
	inputCwd: string;
	outputCwd: string;
	additionalData?: Record<string, any>;
};

export type AssetOptimizerRuleCallbackFnc = (arg: AssetOptimizerRuleArgument) => void;

export type AssetOptimizerRule = {
	callback: AssetOptimizerRuleCallbackFnc;
};

export type AssetOptimizerRules = Record<string, AssetOptimizerRule>;

export type AssetOptimizerCoreConfig = {
	inputCwd: string;
	outputCwd: string;
	rules: AssetOptimizerRules;
};
