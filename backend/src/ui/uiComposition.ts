import express from 'express';
import path from 'path';
import { AssetOptimizerUiConfig } from './types';

type Props = {
	config: AssetOptimizerUiConfig;
};

export function uiComposition({ config }: Props) {
	return {
		start: () => {
			console.log(`1/1 UI:Starting express server at http://localhost:${config.port}`);

			const app = express();

			app.use(express.static(path.join(__dirname, '../../../frontend/dist')));

			app.get('/', (req, res) => {
				res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
			});

			app.listen(config.port);
		},
	};
}
