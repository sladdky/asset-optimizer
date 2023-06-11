import { createServer } from 'http';
import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../core/repositories';
import { runWebsocketServerComposition } from './compositions/runWebsocketServerComposition';
import { AssetOptimizerApiConfig, AssetOptimizerRuleDef } from '../types';

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

			console.log(`1/1 API:Starting API at http://localhost:${config.port}`);
			const runWebsocketServer = runWebsocketServerComposition({
				httpServer,
				socketOptions: {
					cors: {
						origin: ['http://localhost:8080', 'http://localhost:3010'],
					},
					...config.socketOptions,
				},
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
