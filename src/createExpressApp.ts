import express from 'express';
import { type AssetOptimizerStore, type AssetOptimizerExpressApp } from './types';

export function createExpressApp(store: AssetOptimizerStore): AssetOptimizerExpressApp {
	const app = express();

	app.use(express.urlencoded());

	const generateTemplate = () => `
        <h1>AssetOptimizer</h1>
        <form action="/" method="POST">
            <ul>
                ${Object.entries(store.getStructure())
									.map(
										([path, data]) => `<li>${path} <input name="data[]" value='${JSON.stringify(data?.widths)}'></li>`
									)
									.join('')}
            </ul>
            <button>save</button>
        </form>
    `;

	app.get('/', (req, res) => {
		res.send(generateTemplate());
	});
	app.post('/', (req, res) => {
		res.send(generateTemplate());
	});

	return {
		start: () => app.listen(3002),
	};
}
