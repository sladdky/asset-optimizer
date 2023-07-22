import { createQueue } from '../common/createQueue'
import { UFile, Upload, WorkerListeningMessage, WorkerOutgoingMessage } from '../types'

class UserUploadAbortedError extends Error {}

function send(message: WorkerOutgoingMessage) {
	self.postMessage(message)
}

const createUploader = () => {
	const _ufiles: UFile[] = []
	let shouldCheckUploadingUfiles = false

	const onUnqueue = async (uid: UFile['uid']) => {
		const ufile = _ufiles.find((_ufile) => _ufile.uid === uid)
		if (!ufile) {
			return
		}

		const { token } = await requestFileUpload(ufile)
		const BYTES_PER_CHUNK = 20 * 1024 * 1024 //20MB
		const SIZE = ufile.file.size

		let start = 0
		let end = BYTES_PER_CHUNK
		let chunkIndex = 0

		try {
			while (start < SIZE) {
				const chunk = ufile.file.slice(start, end)
				const onProgress = (bytesTransfered: number) => {
					if (shouldCheckUploadingUfiles) {
						const ufile = _ufiles.find((_ufile) => _ufile.uid === uid)
						if (!ufile) {
							throw new UserUploadAbortedError()
						}
					}
					send({
						action: 'EVENT_UPLOAD_PROGRESS',
						data: {
							ufile,
							progress: Math.min((start + bytesTransfered) / SIZE, 1),
						},
					})
				}

				await uploadChunk(token, chunkIndex, chunk, onProgress)
				onProgress(BYTES_PER_CHUNK)
				start = end
				end = start + BYTES_PER_CHUNK
				chunkIndex += 1
			}

			await requestFileUploadEnd(token)

			send({
				action: 'EVENT_UPLOAD_END',
				data: ufile,
			})
		} catch (error) {
			if (error instanceof UserUploadAbortedError) {
				//cleanup? some chunks were uploaded
			} else {
				throw error
			}
		}
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
			xhr.send(
				JSON.stringify({
					relativePath: ufile.file.name,
					size: ufile.file.size,
				})
			)
		})
	}

	const uploadChunk = (token: string, chunkIndex: number, chunk: Blob, onProgress: (bytesTransfered: number) => void) => {
		return new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open('POST', `http://localhost:3011/upload/${token}/${chunkIndex}`)
			xhr.onloadend = () => {
				if (xhr.status !== 200) {
					//@todo: retry? 1x/2x then give up?
				}

				resolve()
			}
			xhr.upload.onprogress = (event) => {
				try {
					onProgress(event.loaded)
				} catch (error) {
					if (error instanceof UserUploadAbortedError) {
						xhr.abort()
						reject('Upload aborted by user.')
					}
				}
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

		shouldCheckUploadingUfiles = true

		send({
			action: 'RESPONSE_REMOVE_FILE',
			data: uid,
		})
	}

	const getUFiles = () => {
		return _ufiles
	}

	const queue = createQueue<UFile['uid']>({
		maxConcurents: 3,
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
	const message: WorkerListeningMessage = event.data

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
