<template>
    <article class="FileItem" :class="{ 'is-rulesetup-open': isRuleSetupOpen, 'has-rules': computedFile.rules.length }" v-if="!computedFile.file.isDir">
        <strong class="FileItem-relativePath FileItem-relativePath--originalFile">
            <span>{{ computedFile.file.relativePath }}</span>
        </strong>
        <div class="FileItem-ruleSetup">
            <div class="FileItem-rulesAndOptimizations">
                <div class="FileItem-rule FileItem-rule--opener">
                    <button class="FileItem-ruleSetupOpener" @click="isRuleSetupOpen = !isRuleSetupOpen"> {{ computedFile.rules.length ? computedFile.rules.length : isRuleSetupVisible ? '-' : '+' }}
                        <Error align="block" message="" v-if="computedFile.hasErrors && !isRuleSetupOpen" />
                    </button>
                </div>
                <div class="FileItem-optimizations">
                    <strong class="FileItem-relativePath FileItem-relativePath--optimization" v-for="optimization in computedFile.optimizations" :key="optimization.id" v-if="!isRuleSetupVisible">
                        <span>{{ optimization.relativePath }}</span>
                    </strong>
                </div>
            </div>
            <div class="FileItem-rulesAndOptimizations" v-for="rule in computedFile.rules" :key="rule.id" v-if="isRuleSetupVisible">
                <div class="FileItem-rule" :class="{ 'has-error': rule.state === 'error' }">
                    <span class="FileItem-ruleName">
                        <div class="FileItem-ruleControls">
                            <button class="FileItem-reset" @click="emit('resetRule', rule.id)">R</button>
                            <button class="FileItem-delete" v-if="!rule.presetRuleId" @click="emit('deleteRule', rule.id)">-</button>
                        </div>
                        <span>{{ rule.ruleName }}</span>
                    </span>
                    <span> {{ rule.state ? `${STATE_MESSAGES[rule.state]}` : `` }} </span>
                    <component :is="RULE_DEFS_BY_NAME[rule.ruleName]?.component" :data="rule.data" @change="(data: any) => handleRuleChange({ ...rule, data })" />
                    <Error align="block" v-if="rule.state === 'error' && rule.error" :message="rule.error" />
                </div>
                <div class="FileItem-optimizations">
                    <strong class="FileItem-relativePath FileItem-relativePath--optimization" v-for="optimization in computedFile.optimizations.filter(optimization => optimization.ruleId === rule.id)" :key="optimization.id">
                        <span>{{ optimization.relativePath }}</span>
                    </strong>
                </div>
            </div>
            <div class="FileItem-rulesAndOptimizations" v-if="isRuleSetupVisible">
                <div class="FileItem-rule FileItem-rule--ruleDefs">
                    <button class="FileItem-ruleDefsOpener">+</button>
                    <div class="FileItem-ruleDefs">
                        <button v-for="ruleDef in computedFile.ruleDefs" :key="ruleDef.ruleName" @click="handleRuleDefClick(ruleDef)"> + {{ ruleDef.ruleName }} </button>
                    </div>
                </div>
                <div class="FileItem-optimizations"> </div>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
import Error from './Error.vue'
import { AssetOptimizerOptimization, AssetOptimizerFile, AssetOptimizerRule, AssetOptimizerRuleDef } from '@/types'
import { computed, defineAsyncComponent, ref } from 'vue'

export type ComputedRuleDef = {
    displayName: string
    component: ReturnType<typeof defineAsyncComponent>
} & AssetOptimizerRuleDef

export type ComputedFile = {
    file: AssetOptimizerFile,
    rules: AssetOptimizerRule[]
    optimizations: AssetOptimizerOptimization[]
    ruleDefs: ComputedRuleDef[]
    hasErrors: boolean
}

const props = defineProps<{
    computedFile: ComputedFile,
}
>()

const STATE_MESSAGES: Record<string, string> = {
    '': '',
    queued: '(queued)',
    optimizing: '(optimizing...)',
    optimized: '',
    error: ''
}

const RULE_DEFS_BY_NAME = computed(() => props.computedFile.ruleDefs.reduce<Record<string, ComputedRuleDef>>((acc, ruleDef) => {
    acc[ruleDef.ruleName] = ruleDef
    return acc
}, {}))

const handleRuleDefClick = (ruleDef: AssetOptimizerRuleDef) => {
    emit('addRule', {
        fileId: props.computedFile.file.id,
        relativePath: props.computedFile.file.relativePath,
        ruleName: ruleDef.ruleName,
        data: undefined
    })
}

const handleRuleChange = (data: AssetOptimizerRule) => {
    emit('updateRule', data)
}

const emit = defineEmits<{
    (event: 'addRule', rule: Omit<AssetOptimizerRule, 'id'>): void
    (event: 'deleteRule', id: number): void
    (event: 'updateRule', rule: AssetOptimizerRule): void
    (event: 'resetRule', id: number): void
}>()

const isRuleSetupOpen = ref(false)
const isRuleSetupVisible = computed(() => !props.computedFile.file.isDir && isRuleSetupOpen.value && (props.computedFile.rules.length || props.computedFile.ruleDefs.length))
</script>

<style lang="stylus">
.FileItem
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
            padding 5px 0

        &--ruleDefs
            margin-top 2px
            &:hover
                .FileItem-ruleDefs
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
            background var(--color-primary)
            color var(--color-primary-invert)
            padding 3px 10px
            cursor pointer
            border-radius var(--border-radius)

    &-ruleDefsOpener
        background var(--color-primary)
        color var(--color-primary-invert)
        padding 3px 10px
        border-radius var(--border-radius)

    &-ruleName
        position relative
        flex 0 0 auto

        &:not(:hover)
            .FileItem-ruleControls
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

    &-ruleControls
        position absolute
        right 100%
        gap 2px
        display flex

        button
            width 20px
            height 20px
            background var(--color-accent)
            color var(--color-accent-invert)

    &-buttonDelete
        background var(--color-accent)
        border-radius var(--border-radius)
        color #fff
        cursor pointer

    &.is-rulesetup-open
        padding-bottom 30px

        .FileItem-ruleSetup
            &:before
                content ''
                position absolute
                top .85em
                bottom 1.1em
                background #ddd
                width 1px

        .FileItem-rule--opener
            &:before,&:after
                background none

        .FileItem-rule--ruleDefs
            &:after
                background none

    &:hover
        .FileItem-relativePath
            span
                overflow-x auto

    &.has-rules:not(.has-error)
        .FileItem-ruleSetupOpener
            color #ddd

    &:not(.has-rules):not(.is-rulesetup-open)
        .FileItem-ruleSetupOpener
            background var(--color-primary)
            color var(--color-primary-invert)
</style>