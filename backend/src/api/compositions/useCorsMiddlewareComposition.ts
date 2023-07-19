import { Express } from 'express';

type Props = {
	expressApp: Express;
};

export function useCorsMiddlewareComposition({ expressApp }: Props) {
	return () => {
		expressApp.use(function (req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
			// res.removeHeader('X-Powered-By');
			next();
		});
	};
}
