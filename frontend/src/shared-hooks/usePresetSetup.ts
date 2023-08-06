import { reactive, ref } from 'vue'

const isPresetSetupOpen = ref(false)

export const usePresetSetup = () => {
	return {
		isPresetSetupOpen,
	}
}
