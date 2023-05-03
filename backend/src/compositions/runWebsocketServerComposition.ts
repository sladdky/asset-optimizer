import { WebSocketServer } from 'ws';
import { FileStore } from '../stores/FileStore';
import { WS_MESSAGE, WS_MESSAGE_CALLBACKS, WS_MESSAGE_VALUES } from '../../../_shared/websockets';

type Props = {
	fileStore: FileStore;
	port: number;
};

export function runWebsocketServerComposition({ fileStore, port }: Props) {
	return () => {
		const wss = new WebSocketServer({
			port,
		});

		wss.on('connection', (ws) => {
			const send = (message: WS_MESSAGE_VALUES) => {
				ws.send(JSON.stringify(message));
			};

			const CALLBACKS: WS_MESSAGE_CALLBACKS = {
				'request:filestore-items': () => {
					send({
						name: 'filestore-items',
						data: {
							items: fileStore.getAll(),
						},
					});
				},
			};

			ws.on('message', (rawMessage: string) => {
				const message: WS_MESSAGE = JSON.parse(rawMessage.toString());
				CALLBACKS[message.name]?.(message.data);
			});

			fileStore.on('change', (file) => {
				send({
					name: 'filestore-itemchanged',
					data: file,
				});
			});
		});
	};
}
