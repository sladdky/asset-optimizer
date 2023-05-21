import { Server, ServerOptions } from 'socket.io';
import { Server as HttpServer } from 'http';
import { FileRepository, OptimizationRepository, RuleRepository } from '../../core/repositories';
import { AssetOptimizerApiClientEvents, AssetOptimizerApiServerEvents } from '../types';
import { createFileHandlers, createRuleHandlers, createOptimizationHandlers, createRuleDefHandlers } from '../handlers';
import { AssetOptimizerFile, AssetOptimizerOptimization, AssetOptimizerRule, AssetOptimizerRuleDef } from '../../types';

type Props = {
	httpServer: HttpServer;
	socketOptions: Partial<ServerOptions>;
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
		ruleDefs: AssetOptimizerRuleDef[];
	};
};

export function runWebsocketServerComposition({ components, httpServer, socketOptions = {} }: Props) {
	return () => {
		const io = new Server<AssetOptimizerApiClientEvents, AssetOptimizerApiServerEvents>(httpServer, socketOptions);

		io.on('connection', (socket) => {
			const { uploadFile, updateFile, deleteFile, listFile, createFile } = createFileHandlers({ components });
			const { listRule, deleteRule, updateRule, createRule } = createRuleHandlers({ components });
			const { listOptimization } = createOptimizationHandlers({ components });
			const { listRuleDef } = createRuleDefHandlers({ components });

			socket.on('file:list', listFile);
			socket.on('file:delete', deleteFile);
			socket.on('file:update', updateFile);
			socket.on('file:upload', uploadFile);
			socket.on('file:create', createFile);

			socket.on('rule:list', listRule);
			socket.on('rule:delete', deleteRule);
			socket.on('rule:update', updateRule);
			socket.on('rule:create', createRule);

			socket.on('optimization:list', listOptimization);

			socket.on('ruledef:list', listRuleDef);

			//@todo emit,listeners by generic type??????
			components['fileRepository'].on('create', (aoFile: AssetOptimizerFile) => {
				socket.emit('file:created', aoFile);
			});
			components['fileRepository'].on('update', (aoFile: AssetOptimizerFile) => {
				socket.emit('file:updated', aoFile);
			});
			components['fileRepository'].on('delete', (aoFile: AssetOptimizerFile) => {
				socket.emit('file:deleted', aoFile);
			});

			//@todo emit,listeners by generic type??????
			components['ruleRepository'].on('create', (rule: AssetOptimizerRule) => {
				socket.emit('rule:created', rule);
			});
			components['ruleRepository'].on('update', (rule: AssetOptimizerRule) => {
				socket.emit('rule:updated', rule);
			});
			components['ruleRepository'].on('delete', (rule: AssetOptimizerRule) => {
				socket.emit('rule:deleted', rule);
			});

			//@todo emit,listeners by generic type??????
			components['optimizationRepository'].on('create', (optimization: AssetOptimizerOptimization) => {
				socket.emit('optimization:created', optimization);
			});
			components['optimizationRepository'].on('update', (optimization: AssetOptimizerOptimization) => {
				socket.emit('optimization:updated', optimization);
			});
			components['optimizationRepository'].on('delete', (optimization: AssetOptimizerOptimization) => {
				socket.emit('optimization:deleted', optimization);
			});
		});
	};
}
