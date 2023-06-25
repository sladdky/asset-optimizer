import { getAoFiles } from '../common/getAoFiles';
import { FileRepository, OptimizationRepository, PresetRepository, PresetRuleRepository, RuleRepository } from '../repositories';
import fs from 'fs';
import path from 'path';
import { AssetOptimizerRule, AssetOptimizerRuleDef } from '../types';
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

			const index = aoFiles.findIndex((aoFile) => aoFile.relativePath === relativePath);
			if (index < 0) {
				const aoFile = components['fileRepository'].create(fsAoFile);
				if (aoFile) {
					applyPresetsToFile(aoFile);
				}
				continue;
			}

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

			aoFiles.splice(index, 1);
		}

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

		const optimizations = components['optimizationRepository'].findAll();

		for (const relativePath in fsAoFiles) {
			const fsAoFile = fsAoFiles[relativePath];

			if (fsAoFile.isDir) {
				fsAoDirs.push(fsAoFile);
				continue;
			}

			//optimized file exists in filesystem but shouldn't
			const index = optimizations.findIndex((optimization) => optimization.relativePath === relativePath);
			if (index < 0) {
				const filename = path.join(outputCwd, relativePath);
				fs.rmSync(filename);

				continue; //skip splice => optimization will be deleted from db
			}

			//optimized file was changed in filesystem manually => drop it and create new through asset-optimizer
			const optimization = optimizations[index];
			if (optimization.modified !== fsAoFile.modified) {
				continue; //skip splice => optimization will be deleted from db
			}

			optimizations.splice(index, 1);
		}

		//@todo delete empty directories?
		// fsAoDirs.forEach(fsAoDir => {
		//
		// })

		optimizations.forEach((optimization) => {
			const rule = components['ruleRepository'].findById(optimization.ruleId);
			if (rule) {
				rule.state = '';
				components['ruleRepository'].update(rule);
			}
		});

		components['optimizationRepository'].deleteMany(optimizations);
	};

	const deleteOphanRules = () => {
		const rulesToDelete: AssetOptimizerRule[] = [];
		const rules = components['ruleRepository'].findAll();

		rules.forEach((rule) => {
			const file = components['fileRepository'].findById(rule.fileId);
			if (!file) {
				rulesToDelete.push(rule);
			}
		});

		components['ruleRepository'].deleteMany(rulesToDelete);
	};

	return () => {
		syncFiles();
		syncOptimizations();
		deleteOphanRules();
	};
}
