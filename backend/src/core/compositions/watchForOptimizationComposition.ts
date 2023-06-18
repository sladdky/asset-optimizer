import { createQueue } from '../common';
import { FileRepository, OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';
import { runOptimizationForRuleComposition } from './runOptimizationForRuleComposition';
import path from 'path';
import fs from 'fs';

type Props = {
	inputCwd: string;
	outputCwd: string;
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
	};
};

export function watchForOptimizationComposition({ inputCwd, outputCwd, ruleDefs, components }: Props) {
	const tempCwd = path.join(inputCwd, '/.ao-data');

	// fs.rmSync(path.join(tempCwd, '.optimized'), { recursive: true, force: true });
	fs.mkdirSync(tempCwd, { recursive: true });

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
			console.error(`FileID: ${fileId} doesnt exist`);
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

	let start = 0;
	const queue = createQueue({
		maxConcurents: 1, //1-10 seems to be ok, if you let create more promises, it slows down websocket communications drastically
		onUnqueue: optimizeFile,
		onStart: () => (start = performance.now()),
		onEnd: () => console.log(performance.now() - start),
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
