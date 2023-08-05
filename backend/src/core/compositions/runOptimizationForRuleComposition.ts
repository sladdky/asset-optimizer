import { log } from '../../logger'
import { FileRepository, OptimizationRepository, RuleRepository } from '../repositories';
import { AssetOptimizerRule, AssetOptimizerRuleDef, OptimizationError } from '../types';
import { createOptMetaComposition } from './createOptMetaComposition';
import fs from 'fs/promises';
import path from 'path';


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

export function runOptimizationForRuleComposition({ inputCwd, outputCwd, tempCwd, ruleDefs, components }: Props) {
	const createOptMeta = createOptMetaComposition({ tempCwd });

	return async (rule: AssetOptimizerRule) => {
		try {
			const ruleDef = ruleDefs.find((_ruleDef) => _ruleDef.ruleName === rule.ruleName);
			if (!ruleDef) {
				throw new Error(`RuleDef with name '${rule.ruleName}' doesnt exist. Either create a new one or delete rule on file`);
			}

			components['optimizationRepository'].deleteWhere({
				query: {
					ruleId: {
						$eq: rule.id,
					},
				},
			});

			const meta = await ruleDef.optimize({
				inputPath: path.join(inputCwd, rule.relativePath),
				createOptMeta: createOptMeta(rule),
				data: rule.data,
			});

			const paths = meta.optimizations.map((metaOptimization) => metaOptimization.relativePath);
			const hasDuplicates = new Set(paths).size !== paths.length;

			if (hasDuplicates) {
				throw new OptimizationError(`File name collision. Optimization created 2 or more files with same name. Verify implementation.`);
			}

			const collidingOptimizations = components['optimizationRepository'].find({
				query: {
					relativePath: {
						$in: paths,
					},
				},
			});

			if (collidingOptimizations.length) {
				throw new OptimizationError(
					`File name collision. Paths: '${collidingOptimizations.map((opt) => opt.relativePath).join(', ')}' already exist.`
				);
			}

			for (const metaOptimization of meta.optimizations) {
				const outputPath = path.join(outputCwd, metaOptimization.relativePath);
				await fs.mkdir(path.dirname(outputPath), {
					recursive: true,
				});
				await fs.rename(metaOptimization.tempPath, outputPath);
				const lstat = await fs.lstat(outputPath);

				components['optimizationRepository'].create({
					relativePath: metaOptimization.relativePath,
					ruleId: rule.id,
					fileId: rule.fileId,
					modified: lstat.mtime.getTime(),
				});
			}

			rule.state = 'optimized';
			components['ruleRepository'].update(rule);
		} catch (error) {
			if (error instanceof OptimizationError) {
				rule.state = 'error';
				rule.error = error.message;
				components['ruleRepository'].update(rule);
				log('CORE', rule.error, 'warning')
				return;
			}
		}
	};
}
