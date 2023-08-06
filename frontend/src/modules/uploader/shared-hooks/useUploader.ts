import { reactive, ref } from 'vue'
import { createUploaderComposition } from '../compositions/createUploaderComposition'
import { createVUploaderComposition } from '../compositions/createVUploaderComposition'

const worker = new Worker(new URL('../workers/uploader.ts', import.meta.url))

const createUploader = createUploaderComposition({ worker })
const uploader = createUploader()
const isUploaderOpen = ref(false)

const createVUploader = createVUploaderComposition()
const vUploader = createVUploader(uploader)

export function useUploader() {
	return {
		vUploader,
		uploader,
		isUploaderOpen
	}
}
