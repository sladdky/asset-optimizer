import { IEntity } from '../repositories/Repository'

export type AssetOptimizerFileMap = Record<string, Omit<AssetOptimizerFile, 'id'>>

export type AssetOptimizerCreateOptMetaProps = Partial<{
	name: (name: string) => string
	ext: (ext: string) => string
	dir: (dir: string) => string
}>

export type AssetOptimizerRuleProps<TData = any> = {
	inputPath: string
	createOptMeta: (props?: AssetOptimizerCreateOptMetaProps) => AssetOptimizerOptimizationMeta
	data: TData
}

export type AssetOptimizerOptimizationMeta = {
	tempPath: string
	relativePath: string
}
export type AssetOptimizerRuleDefCallbackMeta = {
	optimizations: AssetOptimizerOptimizationMeta[]
}

export interface AssetOptimizerRuleDefs {
	copy: {
		ruleName: 'copy'
		data: Record<string, unknown>
	}
	imageAuto: {
		ruleName: 'imageAuto'
		data: Record<string, unknown>
	}
	imageCrop: {
		ruleName: 'imageCrop'
		data: {
			size: string
			strategy: 'exact' | 'fit'
		}
	}
	imageFullCrop: {
		ruleName: 'imageFullCrop'
		data: {
			size: string //desired dimension (W)x(H)
			strategy: 'exact' | 'fit' | 'extract' //area within an image to be cut out (aspect ratio inherited from desired dimensions) - (W)x(H)x(X)x(Y)
			extract?: {
				width: number
				height: number
				top: number
				left: number
			}
			variants: string[] //variants i.e. 1x, 2x, 0_5x, 1200w, 500w, ...
		}
	}
	svgAuto: {
		ruleName: 'svgAuto'
		data: Record<string, unknown>
	}
	videoAuto: {
		ruleName: 'videoAuto'
		data: Record<string, unknown>
	}
	videoCrop: {
		ruleName: 'videoCrop'
		data: {
			size: string //desired dimension (W)x(H)
			fps: number
			strategy: 'exact' | 'fit' //area within an image to be cut out (aspect ratio inherited from desired dimensions) - (W)x(H)x(X)x(Y)
		}
	}
}

export type AssetOptimizerRuleDef = AssetOptimizerRuleDefTransform<AssetOptimizerRuleDefs[keyof AssetOptimizerRuleDefs]>

export type AssetOptimizerRuleDefTransform<T> = T extends {
	ruleName: string
	data: unknown
}
	? AssetOptimizerGenericRuleDef<T>
	: never

export type AssetOptimizerGenericRuleDef<
	T extends {
		ruleName: string
		data: unknown
	}
> = {
	ruleName: T['ruleName']
	dataComponent?: string
	ext: string
	processData: (data: any) => T['data'] | false
	optimize: (props: AssetOptimizerRuleProps<T['data']>) => Promise<AssetOptimizerRuleDefCallbackMeta>
}

export type AssetOptimizerCoreConfig = {
	inputCwd: string
	outputCwd: string
	tempCwd: string
}

export type AssetOptimizerFile = {
	ext: string
	relativePath: string
	modified: number
	isDir: boolean
	isPresetsApplied?: boolean;
	[key: string]: any
} & IEntity //fluent id, after app restart it can change

export type AssetOptimizerOptimization = {
	fileId: number //fluent id, after app restart it can change
	relativePath: string
	ruleId: number
	modified: number
} & IEntity

export type AssetOptimizerRule = {
	fileId: number //fluent id, after app restart it can change
	presetRuleId?: number
	relativePath: string
	ruleName: string
	data: any
	state?: string
	error?: string
} & IEntity

export type AssetOptimizerPresetRule = {
	presetId: number
	ruleName: string
	data?: Record<string, any>
} & IEntity

export type AssetOptimizerPreset = {
	pattern: string
} & IEntity

export class OptimizationError extends Error { }
