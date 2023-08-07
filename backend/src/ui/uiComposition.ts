import express from 'express';
import path from 'path';
import { AssetOptimizerUiConfig } from './types';
import { log } from '../logger';

type Props = {
	config: AssetOptimizerUiConfig;
};

export function uiComposition({ config }: Props) {
	return {
		start: () => {
			log('UI', `Starting express server at \x1b[0m\x1b[34mhttp://localhost:${config.port}/\x1b[2m`);

			const app = express();

			app.use(express.static(path.join(__dirname, '../../../frontend/dist')));

			app.get('/', (req, res) => {
				res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
			});

			app.listen(config.port);
		},
	};
}
