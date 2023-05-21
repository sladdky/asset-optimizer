import { OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';

type Props = {
	inputCwd: string;
	outputCwd: string;
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
	};
};

export function watchForOptimizationComposition({ inputCwd, outputCwd, ruleDefs, components }: Props) {
	const MAX_COUNT_IN_PARALLEL = 5;
	const queue: AssetOptimizerRule[] = [];
	let count = 0;

	const optimize = async (rule: AssetOptimizerRule) => {
		const ruleDef = ruleDefs.find((_ruleDef) => _ruleDef.name === rule.ruleDefName);
		if (!ruleDef) {
			console.error(`RuleDef with name '${rule.ruleDefName}' doesnt exist. Either create a new one or remove rule on file`);
			return;
		}

		//@todo: validate data ?

		count += 1;

		rule.state = 'optimizing';
		components['ruleRepository'].update(rule);

		const meta = await ruleDef.callback({
			relativePath: rule.fileRelativePath,
			inputCwd,
			outputCwd,
			data: rule.data,
		});

		meta.optimizations.forEach((optimization) => {
			components['optimizationRepository'].create({
				...optimization,
				ruleId: rule.id,
			});
		});

		rule.state = 'optimized';
		components['ruleRepository'].update(rule);

		count -= 1;

		runQueue();
	};

	const runQueue = () => {
		if (count > MAX_COUNT_IN_PARALLEL) {
			return;
		}

		const key = queue.shift();
		if (!key) {
			return;
		}

		optimize(key);
	};

	return () => {
		components['ruleRepository'].on('create', (rule: AssetOptimizerRule) => {
			rule.state = 'queued';
			components['ruleRepository'].update(rule);

			queue.push(rule);
			runQueue();
		});

		components['ruleRepository'].on('update', (rule: AssetOptimizerRule) => {
			if (rule.state === 'optimized' || rule.state === 'optimizing' || rule.state === 'queued') {
				return;
			}

			rule.state = 'queued';
			components['ruleRepository'].update(rule);

			queue.push(rule);
			runQueue();
		});
	};
}
