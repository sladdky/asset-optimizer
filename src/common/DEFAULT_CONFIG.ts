import { fallbackCallback } from '../rules/fallbackCallback';
import { imageCallback } from '../rules/imageCallback';
import { svgCallback } from '../rules/svgCallback';
import { videoCallback } from '../rules/videoCallback';
import { AssetOptimizerConfig } from '../types';

export const DEFAULT_CONFIG: AssetOptimizerConfig = {
	cwd: 'public-src/',
	outputCwd: 'public/',
	rules: {
		'jpg|jpeg|png': {
			callback: imageCallback,
		},
		'mov|mp4': {
			callback: videoCallback,
		},
		svg: {
			callback: svgCallback,
		},
		'': {
			callback: fallbackCallback,
		},
	},
};
