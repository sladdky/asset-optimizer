import { computed, reactive, ref } from 'vue'

type Filter = {
	fileRelativePath: string
	optimizationRelativePath: string
}

const filter = reactive<Filter>({
	fileRelativePath: '',
	optimizationRelativePath: '',
})
const isFilterOpen = ref(false)
const isFilterInDefaultState = computed(() => filter.fileRelativePath === '' && filter.optimizationRelativePath === '')

export function useFilter() {
	return {
		filter,
		isFilterOpen,
		isFilterInDefaultState,
	}
}
