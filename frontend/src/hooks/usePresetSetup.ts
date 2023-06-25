import { reactive, ref } from 'vue'

const presetsetup = reactive({
	isOpen: false
})

export const usePresetSetup = () => {
	return {
		presetsetup,
	}
}
