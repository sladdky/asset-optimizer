<template>
    <div ref="target">
        <slot :computedFile="computedFile" />
    </div>
</template>

<script lang="ts" setup>
import { AssetOptimizerFile, AssetOptimizerOptimization, AssetOptimizerRule, AssetOptimizerRuleDef } from '@/types'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useIntersectionObserver, MaybeElement } from '@vueuse/core'
import { ComputedFile, ComputedRuleDef } from './ComputedFile.vue'
import { memoizeWith } from 'ramda'

const props = defineProps<{
    file: AssetOptimizerFile,
    rules: AssetOptimizerRule[],
    optimizations: AssetOptimizerOptimization[]
    ruleDefs: AssetOptimizerRuleDef[]
}
>()

const target = ref<MaybeElement>()
const isVisible = ref(false)

const pickRuleDefs = memoizeWith<(ext: string) => ComputedRuleDef[]>((ext) => ext, (ext) => props.ruleDefs.filter(ruleDef => ext.match(ruleDef.ext)).map(ruleDef => ({
    ...ruleDef,
    component: defineAsyncComponent(() => import(`@/rule-defs/${ruleDef.dataComponent ?? '_Blank'}`))
})))

const computedFile = computed<ComputedFile>(() => {
    const compAoFile = isVisible.value ? {
        file: props.file,
        rules: props.rules.filter(rule => rule.fileId === props.file.id),
        optimizations: props.optimizations.filter(optimization => optimization.fileId === props.file.id),
        ruleDefs: pickRuleDefs(props.file.ext),
    } : {
        file: props.file,
        rules: [],
        optimizations: [],
        ruleDefs: [],
    }

    return {
        ...compAoFile,
        hasErrors: compAoFile.rules.some(rule => rule.state === 'error'),
    }
})

useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
        isVisible.value = isIntersecting
    }, {
    rootMargin: '1000px 0% 1000px 0%'
})

</script>