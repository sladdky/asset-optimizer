import { OutgoingMessage, ListeningMessage, UFile } from '@/workers/uploader'
import { nanoid } from 'nanoid'
import { readonly, ref } from 'vue'


const createUploader = () => {
	const worker = new Worker(new URL('@/workers/uploader.ts', import.meta.url))
	const ufiles = ref<UFile[]>([])

	const send = (message: ListeningMessage) => {
		worker.postMessage(message)
	}

	const addFiles = (files: File[]) => {
		const ufiles = files.map((file) => ({
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

	worker.onmessage = (event) => {
		const message: OutgoingMessage = event.data
		switch (message.action) {
			case 'RESPONSE_ADD_FILE':
				ufiles.value.push(...message.data)
				break
			case 'RESPONSE_REMOVE_FILE':
				const index = ufiles.value.findIndex((ufile) => ufile.uid === message.data)
				if (index >= 0) {
					ufiles.value.splice(index, 1)
				}
				break
			case 'RESPONSE_LIST_FILE':
				ufiles.value = message.data
				break
			case 'EVENT_UPLOAD_END':
				removeUFileByUid(message.data.uid)
				break
		}
	}

	return {
		ufiles: readonly(ufiles),
		addFiles,
		removeUFileByUid,
	}
}

const uploader = createUploader()

export function useUploader() {
	return uploader
}
