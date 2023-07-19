import { AssetOptimizerApiClientEvents, AssetOptimizerApiServerEvents } from '@/types'
import { io, Socket } from 'socket.io-client'

let socket: Socket<AssetOptimizerApiServerEvents, AssetOptimizerApiClientEvents> | null = null

export function useSocket() {
	let _onConnected: () => void

	if (!socket) {
		socket = io('ws://localhost:3011')
	}

	socket.on('connect', () => {
		_onConnected?.()
	})

	const onConnected = (fnc: () => void) => {
		_onConnected = fnc

		if (socket?.connected) {
			_onConnected?.()
		}
	}

	return {
		socket,
		onConnected,
	}
}
