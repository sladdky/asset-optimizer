import express from 'express';
import http from 'http';
import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../core/repositories';
import { runWebsocketServerComposition } from './compositions/runWebsocketServerComposition';
import { AssetOptimizerApiConfig, AssetOptimizerRuleDef } from '../types';
import { useCorsMiddlewareComposition, useDownloadableFilesComposition, useUploaderComposition } from './compositions';

type Props = {
	config: AssetOptimizerApiConfig;
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
		ruleDefs: AssetOptimizerRuleDef[];
	};
};

export function apiComposition({ config, components }: Props) {
	return {
		start: () => {
			const expressApp = express();
			const httpServer = http.createServer(expressApp);

			console.log(`1/4 API:Attaching cors middleware`);
			const useCorsMiddleware = useCorsMiddlewareComposition({
				expressApp,
			});
			useCorsMiddleware();

			console.log(`2/4 API:Serving downlodable files`);
			const serveDownloadableFiles = useDownloadableFilesComposition({
				expressApp,
				tempCwd: config.tempCwd,
			});
			serveDownloadableFiles();

			console.log(`3/4 API:Serving downlodable files`);
			const serveUploader = useUploaderComposition({
				expressApp,
				tempCwd: config.tempCwd,
				inputCwd: config.inputCwd,
			});
			serveUploader();

			console.log(`4/4 API:Starting API at http://localhost:${config.port}`);
			const runWebsocketServer = runWebsocketServerComposition({
				httpServer,
				socketOptions: {
					cors: {
						origin: ['http://localhost:8080', 'http://localhost:3010', 'http://localhost:3011'],
					},
					...config.socketOptions,
				},
				inputCwd: config.inputCwd,
				outputCwd: config.outputCwd,
				tempCwd: config.tempCwd,
				components,
			});
			runWebsocketServer();

			httpServer.listen(config.port);
			process.on('exit', () => {
				httpServer.close();
			});
		},
	};
}
