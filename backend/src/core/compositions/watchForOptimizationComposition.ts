import { createQueue } from '../common';
import { FileRepository, OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';
import { runOptimizationForRuleComposition } from './runOptimizationForRuleComposition';

type Props = {
	inputCwd: string;
	outputCwd: string;
	tempCwd: string;
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
	};
};

export function watchForOptimizationComposition({ inputCwd, outputCwd, tempCwd, ruleDefs, components }: Props) {
	const runOptimizationForRule = runOptimizationForRuleComposition({
		inputCwd,
		outputCwd,
		tempCwd,
		ruleDefs,
		components,
	});

	const optimizeFile = async (fileId: number) => {
		const aoFile = await components['fileRepository'].findById(fileId);
		if (!aoFile) {
			console.error(`CORE: Trying to optimize fileId: ${fileId}, but it doesnt exist anymore`);
			return;
		}

		const rules = await components['ruleRepository'].find({
			query: {
				fileId: {
					$eq: fileId,
				},
				state: {
					$ne: 'optimized',
				},
			},
		});

		for (const rule of rules) {
			await runOptimizationForRule(rule);
		}
	};

	const queue = createQueue({
		maxConcurents: 1, //1-10 seems to be ok, if you let create more promises, it slows down websocket communications drastically
		onUnqueue: optimizeFile,
	});

	return async () => {
		const rules = await components['ruleRepository'].find({
			query: {
				state: {
					$containsNone: ['optimized', 'error'],
				},
			},
		});

		rules.forEach((rule) => {
			queue.add(rule.fileId);
		});

		components['ruleRepository'].on('create', (rule: AssetOptimizerRule) => {
			// rule.state = 'queued';
			// components['ruleRepository'].update(rule);
			queue.add(rule.fileId);
		});

		components['ruleRepository'].on('update', (rule: AssetOptimizerRule) => {
			if (rule.state === 'queued' || rule.state === 'optimizing' || rule.state === 'optimized' || rule.state === 'error') {
				return;
			}

			// rule.state = 'queued';
			// components['ruleRepository'].update(rule);

			queue.add(rule.fileId);
		});
	};
}
