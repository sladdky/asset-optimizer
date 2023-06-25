import { reactive, ref } from 'vue'

type Position =  'top' | 'left' | 'right' | 'bottom'
type Bubble = {
	anchorEl: HTMLElement;
	floatingEl: HTMLElement;
	placement: Position
	content: string
	isVisible: boolean
	show: () => void
	hide: () => void
}

const bubble = reactive<Bubble>({
	anchorEl: document.createElement('div'),
	floatingEl: document.createElement('div'),
	isVisible: false,
	content: '',
	placement: 'right',
	show() {
		clearTimeout(_timer)
		_timer = undefined
		this.isVisible = true
	},
	hide() {
		if (_timer) {
			return
		}
		_timer = setTimeout(() => {
			this.isVisible = false
			_timer = undefined
		}, 200);
	}
})

let _timer : ReturnType<typeof setTimeout> | undefined

export function useBubble() {

	return {
		bubble,
    }
}
