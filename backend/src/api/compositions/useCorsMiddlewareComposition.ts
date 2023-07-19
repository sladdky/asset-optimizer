import { Express } from 'express';

type Props = {
	expressApp: Express;
};

export function useCorsMiddlewareComposition({ expressApp }: Props) {
	return () => {
		expressApp.use(function (req, res, next) {
			const ALLOWED_ORIGINS = ['http://localhost:8080', 'http://localhost:3010'];
			const origin = req.get('origin') ?? '';
			if (ALLOWED_ORIGINS.includes(origin)) {
				res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
				res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
				res.setHeader('Access-Control-Allow-Origin', origin);
			}
			next();
		});
	};
}
