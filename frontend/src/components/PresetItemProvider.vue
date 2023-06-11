<template>
    <slot :computedPreset="computedPreset" />
</template>

<script lang="ts" setup>
import { AssetOptimizerPreset, AssetOptimizerRuleDef, AssetOptimizerPresetRule } from '@/types'
import { computed, defineAsyncComponent } from 'vue'
import { ComputedPresetRuleDef, ComputedPreset } from './PresetItem.vue'

const props = defineProps<{
    preset: AssetOptimizerPreset,
    presetRules: AssetOptimizerPresetRule[],
    ruleDefs: AssetOptimizerRuleDef[]
}
>()

const pickRuleDefs = () => {
    return props.ruleDefs.map(ruleDef => ({
        ...ruleDef,
        component: defineAsyncComponent(() => import(`@/rule-defs/${ruleDef.dataComponent ?? '_Blank'}`))
    })) as ComputedPresetRuleDef[]

}

const computedPreset = computed<ComputedPreset>(() => ({
    preset: props.preset,
    presetRules: props.presetRules.filter(presetRule => presetRule.presetId === props.preset.id),
    ruleDefs: pickRuleDefs(),
}))

</script>