import { reactive } from 'vue'

type Filter = {
	fileRelativePath: string
	optimizationRelativePath: string
}

const filter = reactive<Filter>({
	fileRelativePath: '',
	optimizationRelativePath: '',
})

export function useFilter() {
	return {
        filter
    }
}
