import { reactive } from 'vue'

type Filter = {
	fileRelativePath: string
	optimizationRelativePath: string
	isRulesOpen: boolean
	isPresetsOpen: boolean
}

const filter = reactive<Filter>({
	fileRelativePath: '',
	optimizationRelativePath: '',
	isPresetsOpen: false,
	isRulesOpen: false,
})

export function useFilter() {
	return {
        filter
    }
}
