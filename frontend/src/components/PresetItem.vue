<template>
    <article class="PresetItem" :class="{ 'is-rulesetup-open': isRuleSetupOpen, 'has-rules': computedPreset.presetRules.length }">
        <span class="PresetItem-relativePath PresetItem-relativePath--originalFile">
            <button class="PresetItem-delete" @click="emit('deletePreset', computedPreset.preset.id)">-</button> {{ computedPreset.preset.pattern }} </span>
        <div class="PresetItem-ruleSetup">
            <div class="PresetItem-rulesAndOptimizations">
                <div class="PresetItem-rule PresetItem-rule--opener">
                    <button class="PresetItem-ruleSetupOpener" @click="isRuleSetupOpen = !isRuleSetupOpen"> {{ computedPreset.presetRules.length ? computedPreset.presetRules.length : isRuleSetupVisible ? '-' : '+' }} </button>
                </div>
                <div class="PresetItem-optimizations">
                </div>
            </div>
            <div class="PresetItem-rulesAndOptimizations" v-for="presetRule in computedPreset.presetRules" :key="presetRule.id" v-if="isRuleSetupVisible">
                <div class="PresetItem-rule">
                    <span class="PresetItem-ruleName">
                        <button class="PresetItem-delete" @click="emit('deletePresetRule', presetRule.id)">-</button>
                        <span>{{ presetRule.ruleName }}</span>
                    </span>
                    <component :is="RULE_DEFS_BY_NAME[presetRule.ruleName].component" :data="presetRule.data" @change="(data: any) => handleRuleChange({ ...presetRule, data })" />
                </div>
                <div class="PresetItem-optimizations">
                </div>
            </div>
            <div class="PresetItem-rulesAndOptimizations" v-if="isRuleSetupVisible">
                <div class="PresetItem-rule PresetItem-rule--ruleDefs">
                    <button class="PresetItem-ruleDefsOpener">+</button>
                    <div class="PresetItem-ruleDefs">
                        <button v-for="ruleDef in computedPreset.ruleDefs" :key="ruleDef.ruleName" @click="handleRuleDefClick(ruleDef)"> + {{ ruleDef.ruleName }} </button>
                    </div>
                </div>
                <div class="PresetItem-optimizations"> </div>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
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

const handleRuleChange = (data: AssetOptimizerPresetRule) => {
    emit('updatePresetRule', data)
}

const emit = defineEmits<{
    (event: 'updatePreset', rule: AssetOptimizerPreset): void
    (event: 'deletePreset', id: number): void
    (event: 'addPresetRule', rule: Omit<AssetOptimizerPresetRule, 'id'>): void
    (event: 'deletePresetRule', id: number): void
    (event: 'updatePresetRule', rule: AssetOptimizerPresetRule): void
}>()

const isRuleSetupOpen = ref(false)
const isRuleSetupVisible = computed(() => isRuleSetupOpen.value && (props.computedPreset.presetRules.length || props.computedPreset.ruleDefs.length))
</script>

<style lang="stylus">
.PresetItem
    display flex
    padding 0 20px
    font-size 14px

    &-relativePath
        overflow hidden
        display flex
        align-items flex-start
        white-space nowrap
        width 400px
        height 2em
        gap 10px

        span
            overflow hidden
            display block
            padding-bottom 20px

        &--originalFile
            &:after
                content ''
                background #ddd
                height 1px
                flex 1 1 30px
                margin-top .9em

        &--optimization
            span
                display flex
                justify-content flex-end

            &:before
                content ''
                background #ddd
                height 1px
                flex 1 1 30px
                margin-top .9em

    &-ruleSetupPlaceholder
        flex 1 1 0px
        position relative

    &-ruleSetup
        flex 1 1 0px
        position relative

    &-rulesAndOptimizations
        display flex
        align-items flex-start
        justify-content space-between

    &-rule
        display flex
        align-items flex-start
        flex 1 1 0px
        white-space nowrap
        gap 10px

        &:before,
        &:after
            content ''
            background #ddd
            height 1px
            flex 1 1 30px
            margin-top .9em

        &:before
            flex 0 0 30px

        &.has-error
            background #fdd

        &--ruleDefs
            &:hover
                .PresetItem-ruleDefs
                    display flex



    &-ruleSetupOpener
        padding 5px 10px
        display flex
        align-items center
        justify-content center
        background none
        cursor pointer
        border-radius var(--border-radius)

        &:hover
            background #f4f4f4

    &-optimizations
        position relative
        width 400px
        display flex
        flex-flow column
        white-space nowrap

        &:before
            content ''
            position absolute
            top .85em
            bottom 1.1em
            background #ddd
            width 1px

    &-optimization
        display flex

        &:before
            content ''
            background #ddd
            height 1px
            flex 1 1 30px
            margin-top .9em

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

        &:not(:hover)
            .PresetItem-delete
                display none

        &.has-error
            &:after
                content '!'
                display inline-block
                text-align center
                background red
                color #fff
                width 1.5em
                height 1.5em
                border-radius 50%
                margin-left 5px

    &-delete
        background: var(--color-accent);
        color: var(--color-accent-invert);
        border-radius var(--border-radius)
        cursor pointer
        width 20px
        height 20px

    &.is-rulesetup-open
        padding-bottom 30px

        .PresetItem-ruleSetup
            &:before
                content ''
                position absolute
                top .85em
                bottom 1.1em
                background #ddd
                width 1px

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


    &.has-rules:not(.has-error)
        .PresetItem-ruleSetupOpener
            color #ddd

    &:not(.has-rules):not(.is-rulesetup-open)
        .PresetItem-ruleSetupOpener
            background var(--color-primary)
            color var(--color-primary-invert)

</style>