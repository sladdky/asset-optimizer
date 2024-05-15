import { WorkerOutgoingMessage, WorkerListeningMessage, UFile, UploaderOptions } from '../types'
import { nanoid } from 'nanoid'
import { readonly, ref } from 'vue'
import { Uploader } from '../types'

type Props = {
	worker: Worker
}

export function createUploaderComposition({ worker }: Props) {
	return (): Uploader => {
		const ufiles = ref<UFile[]>([])

		const send = (message: WorkerListeningMessage) => {
			worker.postMessage(message)
		}

		const addFiles = (files: File[]) => {
			const ufiles = files.map((file) => ({
				progress: 0,
				uid: nanoid(),
				file,
			}))
			send({
				action: 'ADD_FILE',
				data: ufiles,
			})
		}

		const removeUFileByUid = (uid: string) => {
			send({
				action: 'REMOVE_FILE',
				data: uid,
			})
		}

		const updateOptions = (options: Partial<UploaderOptions>) => {
			send({
				action: 'UPDATE_OPTIONS',
				data: options
			})
		}

		worker.onmessage = (event) => {
			const message: WorkerOutgoingMessage = event.data

			switch (message.action) {
				case 'RESPONSE_ADD_FILE':
					{
						ufiles.value.push(...message.data)
					}
					break
				case 'RESPONSE_REMOVE_FILE':
					{
						const index = ufiles.value.findIndex((ufile) => ufile.uid === message.data)
						if (index >= 0) {
							ufiles.value.splice(index, 1)
						}
					}
					break
				case 'RESPONSE_LIST_FILE':
					{
						ufiles.value = message.data
					}
					break
				case 'EVENT_UPLOAD_END':
					{
						removeUFileByUid(message.data.uid)
					}
					break
				case 'EVENT_UPLOAD_PROGRESS':
					{
						const ufile = ufiles.value.find((ufile) => ufile.uid === message.data.ufile.uid)
						if (ufile) {
							ufile.progress = message.data.progress
						}
					}
					break
			}
		}

		return {
			updateOptions,
			ufiles: readonly(ufiles),
			addFiles,
			removeUFileByUid,
		}
	}
}
