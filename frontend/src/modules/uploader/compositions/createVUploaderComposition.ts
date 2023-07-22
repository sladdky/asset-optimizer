import { Directive } from 'vue'
import { Uploader } from '../types'

type VUploaderSourceElement = {
	_vUploaderHandleDrop: (event: DragEvent) => void
	_vUploaderHandleDragOver: (event: DragEvent) => void
	_vUploaderHandleDragLeave: (event: DragEvent) => void
} & HTMLElement

export function createVUploaderComposition() {
	return (uploader: Uploader): Directive<VUploaderSourceElement> => ({
		created(el, binding, vnode, prevVnode) {
			el._vUploaderHandleDrop = (event) => {
				event.preventDefault()
				const files = [...(event.dataTransfer?.files ?? [])]
				uploader.addFiles(files)
				el.setAttribute('data-uploader', '')
			}

			el._vUploaderHandleDragOver = (event) => {
				event.preventDefault()
				// if (event.dataTransfer) {
				// 	event.dataTransfer.dropEffect = 'copy'
				// }
				el.setAttribute('data-uploader', 'highlighted')
			}

			el._vUploaderHandleDragLeave = (event) => {
				event.preventDefault()
				el.setAttribute('data-uploader', '')
			}

			el.addEventListener('dragover', el._vUploaderHandleDragOver)
			el.addEventListener('dragleave', el._vUploaderHandleDragLeave)
			el.addEventListener('drop', el._vUploaderHandleDrop)
			el.setAttribute('data-uploader', '')
		},
		beforeMount() {},
		mounted() {},
		beforeUpdate() {},
		updated() {},
		beforeUnmount() {},
		unmounted(el, binding, vnode, prevVnode) {
			el.removeEventListener('dragover', el._vUploaderHandleDragOver)
			el.removeEventListener('dragleave', el._vUploaderHandleDragLeave)
			el.removeEventListener('drop', el._vUploaderHandleDrop)
			el.removeAttribute('data-uploader')
		},
	})
}
