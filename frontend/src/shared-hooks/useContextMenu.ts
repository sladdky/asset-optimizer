import { Directive, reactive, readonly, ref } from 'vue'

type ContextMenuSourceElement = {
	_vContextMenuHandleMouseDown: (event: MouseEvent) => void
	_vContextMenuHandleMouseEnter: (event: MouseEvent) => void
	_vContextMenuHandleDocumentMouseUp: (event: MouseEvent) => void
} & HTMLElement

type ContextMenuSourceInfo =
	| {
			type: 'Unkown'
	  }
	| {
			type: 'AoFile'
			id: number
	  }
	| {
			type: 'Optimization'
			id: number
	  }
	| {
			type: 'Rule'
			id: number
	  }
	| {
			type: 'Preset'
			id: number
	  }
	| {
			type: 'PresetRule'
			id: number
	  }

type ContextMenuSource = {
	el: ContextMenuSourceElement
	info: ContextMenuSourceInfo
}

export type ContextMenuSourceTypes = ContextMenuSourceInfo['type']

const createContextmenu = () => {
	const sources: ContextMenuSource[] = reactive([])

	const addSource = (source: ContextMenuSource, index: number = -1) => {
		index = index < 0 ? sources.findIndex((_source) => _source.el === source.el) : index
		if (index >= 0) {
			return
		}

		sources.push(source)
		source.el.setAttribute('data-contextmenu', 'selected')
	}

	const removeSourceByEl = (sourceEl: ContextMenuSourceElement, index: number = -1) => {
		index = index < 0 ? sources.findIndex((_source) => _source.el === sourceEl) : index
		if (index < 0) {
			return
		}

		sources.splice(index, 1)
		sourceEl.setAttribute('data-contextmenu', '')
	}
	const toggleSource = (source: ContextMenuSource) => {
		const index = sources.findIndex((_source) => _source.el === source.el)
		if (index >= 0) {
			removeSourceByEl(source.el, index)
			return false
		} else {
			addSource(source, index)
			return true
		}
	}

	const removeAllSources = () => {
		sources.forEach((source) => {
			source.el.setAttribute('data-contextmenu', '')
		})
		sources.length = 0
	}

	return {
		sources: readonly(sources),
		addSource,
		removeSourceByEl,
		removeAllSources,
		toggleSource,
	}
}

const contextmenu = createContextmenu()

const state = reactive<{
	isSelecting: boolean
	action: 'select' | 'deselect'
}>({
	isSelecting: false,
	action: 'select',
})

export function useContextMenu() {
	const vContextmenu: Directive<ContextMenuSourceElement, ContextMenuSourceInfo> = {
		created(el, binding, vnode, prevVnode) {
			el._vContextMenuHandleDocumentMouseUp = () => {
				state.isSelecting = false
				document.removeEventListener('mouseup', el._vContextMenuHandleDocumentMouseUp)
			}

			el._vContextMenuHandleMouseDown = () => {
				const wasAdded = contextmenu.toggleSource({
					el,
					info: binding.value,
				})

				state.action = wasAdded ? 'select' : 'deselect'
				state.isSelecting = true
				document.addEventListener('mouseup', el._vContextMenuHandleDocumentMouseUp)
			}

			el._vContextMenuHandleMouseEnter = () => {
				if (!state.isSelecting) {
					return
				}

				if (state.action === 'select') {
					contextmenu.addSource({
						el,
						info: binding.value,
					})
				} else {
					contextmenu.removeSourceByEl(el)
				}
			}

			el.setAttribute('data-contextmenu', '')
			el.addEventListener('mousedown', el._vContextMenuHandleMouseDown)
			el.addEventListener('mouseenter', el._vContextMenuHandleMouseEnter)
		},
		beforeMount() {},
		mounted() {},
		beforeUpdate() {},
		updated() {},
		beforeUnmount() {},
		unmounted(el, binding, vnode, prevVnode) {
			el.removeEventListener('click', el._vContextMenuHandleMouseEnter)
			el.removeEventListener('click', el._vContextMenuHandleDocumentMouseUp)
			el.removeEventListener('click', el._vContextMenuHandleMouseDown)
			el.removeAttribute('data-contextmenu')
			contextmenu.removeSourceByEl(el)
		},
	}

	return {
		vContextmenu,
		contextmenu,
	}
}
