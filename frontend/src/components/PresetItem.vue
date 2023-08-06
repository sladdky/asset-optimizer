<template>
    <article class="PresetItem" :class="{ 'is-rulesetup-open': isRuleSetupOpen, 'has-rules': computedPreset.presetRules.length }">
        <span class="PresetItem-relativePath PresetItem-relativePath--originalFile">
            <span v-contextmenu="{ 'type': 'Preset', id: computedPreset.preset.id }">{{ computedPreset.preset.pattern }}</span>
        </span>
        <div class="PresetItem-toggler">
            <button class="PresetItem-togglerButton" @click="isRuleSetupOpen = !isRuleSetupOpen"> {{ computedPreset.presetRules.length }} </button>
        </div>
        <div>
            <div class="PresetItem-rulesAndOptimizations">
                <div class="PresetItem-rule PresetItem-rule--ruleDefs" v-if="isRuleSetupOpen || (!computedPreset.presetRules.length && !isRuleSetupOpen)">
                    <button class="PresetItem-ruleDefsOpener">+</button>
                    <div class="PresetItem-ruleDefs">
                        <button v-for="ruleDef in computedPreset.ruleDefs" :key="ruleDef.ruleName" @click="handleRuleDefClick(ruleDef)"> + {{ ruleDef.ruleName }} </button>
                    </div>
                </div>
            </div>
            <div class="PresetItem-rulesAndOptimizations" v-for="presetRule in computedPreset.presetRules" :key="presetRule.id" v-if="isRuleSetupOpen">
                <div class="PresetItem-rule">
                    <span class="PresetItem-ruleName">
                        <span v-contextmenu="{ 'type': 'PresetRule', id: presetRule.id }">{{ presetRule.ruleName }}</span>
                    </span>
                    <component :is="RULE_DEFS_BY_NAME[presetRule.ruleName].component" :data="presetRule.data" @change="(data: any) => handlePresetRuleChange({ ...presetRule, data })" />
                </div>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
import { useContextMenu } from '@/shared-hooks'
import { AssetOptimizerRuleDef, AssetOptimizerPreset, AssetOptimizerPresetRule } from '@/types'
import { computed, defineAsyncComponent, ref } from 'vue'

export type ComputedPreset = {
    preset: AssetOptimizerPreset
    presetRules: AssetOptimizerPresetRule[]
    ruleDefs: ComputedPresetRuleDef[]
}

export type ComputedPresetRuleDef = {
    component: ReturnType<typeof defineAsyncComponent>
} & AssetOptimizerRuleDef

const props = defineProps<{
    computedPreset: ComputedPreset,
}
>()

const RULE_DEFS_BY_NAME = computed(() => props.computedPreset.ruleDefs.reduce<Record<string, ComputedPresetRuleDef>>((acc, ruleDef) => {
    acc[ruleDef.ruleName] = ruleDef
    return acc
}, {}))

const handleRuleDefClick = (ruleDef: ComputedPresetRuleDef) => {
    emit('addPresetRule', {
        presetId: props.computedPreset.preset.id,
        ruleName: ruleDef.ruleName,
        data: undefined
    })
}

const handlePresetRuleChange = (data: AssetOptimizerPresetRule) => {
    emit('updatePresetRule', data)
}

const emit = defineEmits<{
    (event: 'addPresetRule', rule: Omit<AssetOptimizerPresetRule, 'id'>): void
    (event: 'updatePresetRule', rule: AssetOptimizerPresetRule): void
}>()

const { vContextmenu } = useContextMenu()

const isRuleSetupOpen = ref(false)
</script>

<style lang="stylus">
line(direction = 'horizontal')
    if direction == 'vertical'
        content ''
        position absolute
        top -.9em
        bottom .6em
        background #333
        width 1px
    else
        content ''
        background #333
        height 1px
        margin-top .9em

.PresetItem
    display grid
    grid-template-columns 385px 70px 1fr

    &-relativePath
        overflow hidden
        display flex
        align-items flex-start
        white-space nowrap
        height 2em
        gap 10px

        span
            overflow hidden
            display block
            padding-bottom 20px

        &--originalFile
            &:after
                line()
                flex 1 1 30px

    &-toggler
        display flex
        align-items flex-start

        &:before,
        &:after
            line()
            flex 1 1 30px

    &-togglerButton
        padding 3px 10px
        display flex
        align-items center
        justify-content center
        background none
        cursor pointer
        border-radius var(--border-radius)

        &:hover
            background #000
            color #fff

    &-rulesAndOptimizations
        position relative
        display flex
        align-items flex-start
        justify-content space-between

        &+&
            &:before
                line('vertical')

    &-rule
        display flex
        align-items flex-start
        flex 1 1 0px
        white-space nowrap
        gap 10px

        &:before
            line()
            flex 0 0 30px

        &.has-error
            background #fdd

        &--ruleDefs
            &:hover
                .PresetItem-ruleDefs
                    display flex

    &-ruleDefs
        display flex
        gap 3px
        margin-left -38px
        display none

        button
            padding 3px 10px
            background var(--color-primary)
            color var(--color-primary-invert)
            border-radius var(--border-radius)
            cursor pointer

    &-ruleDefsOpener
        background var(--color-primary)
        color var(--color-primary-invert)
        border-radius var(--border-radius)
        padding 3px 10px

    &-ruleName
        padding-left 25px
        margin-left -25px
        flex 0 0 auto

    &.is-rulesetup-open
        padding-bottom 30px

        .PresetItem-rule--opener
            &:before,&:after
                background none

        .PresetItem-rule--ruleDefs
            &:after
                background none

    &:hover
        .PresetItem-relativePath
            span
                overflow-x auto

    &:not(.has-error)
        .PresetItem-togglerButton
            color #666

    &:not(.has-rules)
        .PresetItem-togglerButton
            display none

        .PresetItem-toggler
            &:after
                content none

    &:not(.is-rulesetup-open)
        .PresetItem-toggler
            &:after
                opacity 0

</style>