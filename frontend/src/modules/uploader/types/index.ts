import { DeepReadonly, Ref, UnwrapNestedRefs } from 'vue'

export type Uploader = {
	ufiles: DeepReadonly<UnwrapNestedRefs<Ref<UFile[]>>>
	addFiles: (files: File[]) => void
	removeUFileByUid: (uid: string) => void
}

export type UFile = {
	progress: number
	uid: string
	file: File
}

export type Upload = {
	relativePath: string
	token: string
	size: number
}

export type WorkerListeningMessage =
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

export type WorkerOutgoingMessage =
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
	| {
			action: 'EVENT_UPLOAD_PROGRESS'
			data: {
				ufile: UFile
				progress: number
			}
	  }
