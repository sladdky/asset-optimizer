import express from 'express';
import path from 'path';

type Props = {
	port: number;
};

export function runExpressAppComposition({ port }: Props) {
	return () => {
		const app = express();

		app.use(express.static(path.join(__dirname, '../../../frontend/dist')));

		app.get('/', (req, res) => {
			res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
		});

		app.listen(port);
	};
}
