import { getAoFiles } from '../common/getAoFiles';
import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import fs from 'fs';
import path from 'path';
import { AssetOptimizerPresetRule, AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';
import { applyPresetsToFileComposition } from './applyPresetsToFileComposition';

type Props = {
	inputCwd: string;
	outputCwd: string;
	ruleDefs: AssetOptimizerRuleDef[];
	components: {
		fileRepository: FileRepository;
		ruleRepository: RuleRepository;
		optimizationRepository: OptimizationRepository;
		presetRuleRepository: PresetRuleRepository;
		presetRepository: PresetRepository;
	};
};

export function syncComposition({ inputCwd, outputCwd, ruleDefs, components }: Props) {
	const applyPresetsToFile = applyPresetsToFileComposition({ ruleDefs, components });

	const syncFiles = () => {
		const fsAoFiles = getAoFiles('', {
			cwd: inputCwd,
			ignoredPaths: ['.ao-data'],
		});

		const aoFiles = components['fileRepository'].findAll();

		for (const relativePath in fsAoFiles) {
			const fsAoFile = fsAoFiles[relativePath];

			//new file when service was down => create file, apply presets
			const index = aoFiles.findIndex((aoFile) => aoFile.relativePath === relativePath);
			if (index < 0) {
				const aoFile = components['fileRepository'].create(fsAoFile);
				if (aoFile) {
					applyPresetsToFile(aoFile);
				}
				continue;
			}

			//file changed when service was down => update rules
			const aoFile = aoFiles[index];
			if (aoFile.modified !== fsAoFile.modified) {
				const rules = components['ruleRepository'].find({
					query: {
						fileId: {
							$eq: aoFile.id,
						},
					},
				});

				rules.forEach((rule) => {
					rule.state = '';
					components['ruleRepository'].update(rule);
				});
			}

			applyPresetsToFile(aoFile);

			aoFiles.splice(index, 1);
		}

		//file deleted when service was down => remove all asociated rules and optimizations
		aoFiles.forEach((aoFile) => {
			components['ruleRepository'].deleteWhere({
				query: {
					relativePath: {
						$eq: aoFile.relativePath,
					},
				},
			});
			components['optimizationRepository'].deleteWhere({
				query: {
					relativePath: {
						$eq: aoFile.relativePath,
					},
				},
			});
		});

		components['fileRepository'].deleteMany(aoFiles);
	};

	const syncOptimizations = () => {
		fs.mkdirSync(outputCwd, {
			recursive: true,
		});

		const fsAoFiles = getAoFiles('', {
			cwd: outputCwd,
			ignoredPaths: ['.ao-data'],
		});
		const fsAoDirs = [];

		const optimizationsToDelete = [];
		const optimizations = components['optimizationRepository'].findAll();

		for (const relativePath in fsAoFiles) {
			const fsAoFile = fsAoFiles[relativePath];

			if (fsAoFile.isDir) {
				fsAoDirs.push(fsAoFile);
				continue;
			}

			const optimization = optimizations.find((optimization) => optimization.relativePath === relativePath);

			//optimized file exists in fs but shouldn't => delete the optimization files from fs
			if (!optimization) {
				const filename = path.join(outputCwd, relativePath);
				fs.rmSync(filename);
				continue;
			}

			//optimized file changed in fs manually => drop it and create new through asset-optimizer
			if (optimization.modified !== fsAoFile.modified) {
				optimizationsToDelete.push(optimization);
				continue;
			}

			//optimized file exists in fs but doesnt have rule, we have no record how it was created => delete optimization
			if (!components['ruleRepository'].findById(optimization.ruleId)) {
				optimizationsToDelete.push(optimization);
				continue;
			}
		}

		//@todo delete empty directories?
		// fsAoDirs.forEach(fsAoDir => {
		//
		// })

		components['optimizationRepository'].deleteMany(optimizationsToDelete);
	};

	const deleteOphanPresetRules = () => {
		const presetRulesToDelete: AssetOptimizerPresetRule[] = [];
		const presetRules = components['presetRuleRepository'].findAll();

		//presetrule was created byt preset but preset no longer exists => delete presetrule
		presetRules.forEach((presetRule) => {
			if (presetRule.presetId && !components['presetRepository'].findById(presetRule.presetId)) {
				presetRulesToDelete.push(presetRule);
			}
		});

		components['presetRuleRepository'].deleteMany(presetRulesToDelete);
	};

	const deleteOphanRules = () => {
		const rulesToDelete: AssetOptimizerRule[] = [];
		const rules = components['ruleRepository'].findAll();

		rules.forEach((rule) => {
			//invalid file => delete rule
			if (!rule.fileId) {
				rulesToDelete.push(rule);
				return;
			}

			//file doesnt exists => delete rule
			const file = components['fileRepository'].findById(rule.fileId);
			if (!file) {
				rulesToDelete.push(rule);
				return;
			}

			//rule was created byt presetrule but presetrule no longer exists => delete rule
			if (rule.presetRuleId && !components['presetRuleRepository'].findById(rule.presetRuleId)) {
				rulesToDelete.push(rule);
			}
		});

		components['ruleRepository'].deleteMany(rulesToDelete);
	};

	return () => {
		syncFiles();
		deleteOphanPresetRules(); //must be before deleteOphanRules()
		deleteOphanRules(); //must be before syncOptimizations()
		syncOptimizations();
	};
}
