import { FileStore } from '../core/stores';
import { AssetOptimizerApiConfig } from './types';
import { runWebsocketServerComposition } from './compositions/runWebsocketServerComposition';

type Props = {
	config: AssetOptimizerApiConfig;
	fileStore: FileStore;
};

export function startApiComposition({ config, fileStore }: Props) {
	return () => {
		console.log('1/1 API:Starting websocket server...');
		const runWebsocketServer = runWebsocketServerComposition({
			port: config.port,
			fileStore,
		});
		runWebsocketServer();
	};
}
