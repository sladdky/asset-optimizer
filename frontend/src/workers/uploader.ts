import { createQueue } from '../../../backend/src/core/common/createQueue'

export type UFile = {
	uid: string
	file: File
}

export type Upload = {
	relativePath: string
	token: string
	size: number
}

export type ListeningMessage =
	| {
			action: 'REMOVE_FILE'
			data: string
	  }
	| {
			action: 'ADD_FILE'
			data: UFile[]
	  }
	| {
			action: 'LIST_FILE'
			data: UFile[]
	  }

export type OutgoingMessage =
	| {
			action: 'RESPONSE_REMOVE_FILE'
			data: string
	  }
	| {
			action: 'RESPONSE_ADD_FILE'
			data: UFile[]
	  }
	| {
			action: 'RESPONSE_LIST_FILE'
			data: UFile[]
	  }
	| {
			action: 'EVENT_UPLOAD_END'
			data: UFile
	  }

function send(message: OutgoingMessage) {
	self.postMessage(message)
}

const createUploader = () => {
	const _ufiles: UFile[] = []

	const onUnqueue = async (uid: UFile['uid']) => {
		const ufile = _ufiles.find((_ufile) => _ufile.uid === uid)
		if (!ufile) {
			return
		}

		const {token} = await requestFileUpload(ufile)
		const BYTES_PER_CHUNK = 10 * 1024 * 1024 //10MB
		const SIZE = ufile.file.size

		let start = 0
		let end = BYTES_PER_CHUNK
		let chunkIndex = 0

		while (start < SIZE) {
			const chunk = ufile.file.slice(start, end)
			try {
				await uploadChunk(token, chunkIndex, chunk)
				start = end
				end = start + BYTES_PER_CHUNK
				chunkIndex += 1
			} catch (error) {
				console.log(error)
			}
		}

		await requestFileUploadEnd(token)

		send({
			action: 'EVENT_UPLOAD_END',
			data: ufile,
		})
	}

	const requestFileUpload = (ufile: UFile) => {
		return new Promise<Upload>((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open('POST', 'http://localhost:3011/upload-register')
			xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.onloadend = (event) => {
				if (xhr.status !== 200) {
					//@todo: throw away
				}

				resolve(JSON.parse(xhr.response))
			}
			xhr.onerror = () => {
				//@todo: throw away
			}
			xhr.onabort = () => {
				//@todo: retry?
			}
			xhr.send(JSON.stringify({
				relativePath: ufile.file.name,
				size: ufile.file.size
			}))
		})
	}

	const uploadChunk = (token: string, chunkIndex: number, chunk: Blob) => {
		return new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open('POST', `http://localhost:3011/upload/${token}/${chunkIndex}`)
			xhr.onloadend = () => {
				if (xhr.status !== 200) {
					//@todo: retry? 1x/2x then give up?
				}

				resolve()
			}
			xhr.onerror = () => {
				//@todo: wait for 30s and retry?
			}
			xhr.onabort = () => {
				//@todo: wait for 30s and retry?
			}
			xhr.send(chunk)
		})
	}

	const requestFileUploadEnd = (token: string) => {
		return new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open('POST', `http://localhost:3011/upload-end/${token}`)
			xhr.onloadend = (event) => {
				if (xhr.status !== 200) {
					//@todo:  retry?
				}

				resolve()
				// JSON.parse(xhr.response)
			}
			xhr.onerror = () => {
				//@todo: retry?
			}
			xhr.onabort = () => {
				//@todo: retry?
			}
			xhr.send()
		})
	}

	const addUFiles = (ufiles: UFile[]) => {
		_ufiles.push(...ufiles)
		ufiles.forEach((ufile) => queue.add(ufile.uid))

		send({
			action: 'RESPONSE_ADD_FILE',
			data: ufiles,
		})
	}
	const removeUFileByUid = (uid: string) => {
		const index = _ufiles.findIndex((ufile) => ufile.uid === uid)
		if (index < 0) {
			return
		}
		_ufiles.splice(index, 1)

		send({
			action: 'RESPONSE_REMOVE_FILE',
			data: uid,
		})
	}

	const getUFiles = () => {
		return _ufiles
	}

	const queue = createQueue<UFile['uid']>({
		maxConcurents: 1,
		onUnqueue,
	})

	return {
		getUFiles,
		addUFiles,
		removeUFileByUid,
	}
}
const uploader = createUploader()

self.onmessage = function (event) {
	const message: ListeningMessage = event.data

	switch (message.action) {
		case 'REMOVE_FILE':
			uploader.removeUFileByUid(message.data)
			break
		case 'ADD_FILE':
			self.postMessage(message)
			uploader.addUFiles(message.data)
			break
		case 'LIST_FILE':
			uploader.getUFiles()
			break
	}
}
