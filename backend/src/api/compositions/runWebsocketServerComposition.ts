import { Server, ServerOptions } from 'socket.io';
import { Server as HttpServer } from 'http';
import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../../core/repositories';
import { AssetOptimizerApiClientEvents, AssetOptimizerApiServerEvents } from '../types';
import { createFileHandlers, createRuleHandlers, createOptimizationHandlers, createRuleDefHandlers, createPresetRuleHandlers } from '../handlers';
import {
	AssetOptimizerFile,
	AssetOptimizerOptimization,
	AssetOptimizerPreset,
	AssetOptimizerPresetRule,
	AssetOptimizerRule,
	AssetOptimizerRuleDef,
} from '../../types';
import { createPresetHandlers } from '../handlers/createPresetHandlers';

type Props = {
	inputCwd: string;
	outputCwd: string;
	tempCwd: string;
	httpServer: HttpServer;
	socketOptions: Partial<ServerOptions>;
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
		presetRepository: PresetRepository;
		presetRuleRepository: PresetRuleRepository;
		ruleDefs: AssetOptimizerRuleDef[];
	};
};

export function runWebsocketServerComposition({ inputCwd, outputCwd, tempCwd, components, httpServer, socketOptions = {} }: Props) {
	return () => {
		const io = new Server<AssetOptimizerApiClientEvents, AssetOptimizerApiServerEvents>(httpServer, socketOptions);

		io.on('connection', (socket) => {
			const { uploadFile, deleteFile, listFile, createFile, previewImageFile, downloadManyFile } = createFileHandlers({
				inputCwd,
				tempCwd,
				components,
			});
			const { listRule, deleteRule, updateRule, createRule, resetRule } = createRuleHandlers({ components });
			const { listOptimization, previewImageOptimization, downloadManyOptimization } = createOptimizationHandlers({ outputCwd, tempCwd, components });
			const { listRuleDef } = createRuleDefHandlers({ components });
			const { listPreset, deletePreset, updatePreset, createPreset } = createPresetHandlers({ components });
			const { listPresetRule, deletePresetRule, updatePresetRule, createPresetRule } = createPresetRuleHandlers({ components });

			socket.on('file:list', listFile);
			socket.on('file:delete', deleteFile);
			socket.on('file:upload', uploadFile);
			socket.on('file:create', createFile);
			socket.on('file:downloadmany', downloadManyFile);
			socket.on('file:previewimage', previewImageFile);

			socket.on('rule:list', listRule);
			socket.on('rule:delete', deleteRule);
			socket.on('rule:update', updateRule);
			socket.on('rule:create', createRule);
			socket.on('rule:reset', resetRule);

			socket.on('preset:list', listPreset);
			socket.on('preset:delete', deletePreset);
			socket.on('preset:update', updatePreset);
			socket.on('preset:create', createPreset);

			socket.on('presetrule:list', listPresetRule);
			socket.on('presetrule:delete', deletePresetRule);
			socket.on('presetrule:update', updatePresetRule);
			socket.on('presetrule:create', createPresetRule);

			socket.on('optimization:previewimage', previewImageOptimization);
			socket.on('optimization:downloadmany', downloadManyOptimization);
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

			//@todo emit,listeners by generic type??????
			components['presetRepository'].on('create', (preset: AssetOptimizerPreset) => {
				socket.emit('preset:created', preset);
			});
			components['presetRepository'].on('update', (preset: AssetOptimizerPreset) => {
				socket.emit('preset:updated', preset);
			});
			components['presetRepository'].on('delete', (preset: AssetOptimizerPreset) => {
				socket.emit('preset:deleted', preset);
			});

			//@todo emit,listeners by generic type??????
			components['presetRuleRepository'].on('create', (presetRule: AssetOptimizerPresetRule) => {
				socket.emit('presetrule:created', presetRule);
			});
			components['presetRuleRepository'].on('update', (presetRule: AssetOptimizerPresetRule) => {
				socket.emit('presetrule:updated', presetRule);
			});
			components['presetRuleRepository'].on('delete', (presetRule: AssetOptimizerPresetRule) => {
				socket.emit('presetrule:deleted', presetRule);
			});
		});

		process.on('exit', () => {
			io.close();
		});
	};
}
