import { createServer } from 'http';
import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../core/repositories';
import { runWebsocketServerComposition } from './compositions/runWebsocketServerComposition';
import { AssetOptimizerApiConfig, AssetOptimizerRuleDef } from '../types';
import { serveDownloadableFilesComposition } from './compositions';

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
			const httpServer = createServer();

			console.log(`1/2 API:Serving downlodable files`);
			const serveDownloadableFiles = serveDownloadableFilesComposition({
				httpServer,
				tempCwd: config.tempCwd,
			});
			serveDownloadableFiles();

			console.log(`1/3 API:Starting API at http://localhost:${config.port}`);
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
