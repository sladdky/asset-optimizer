<template>
    <article class="ComputedFile" :class="{ 'is-open': isOpen, 'has-rules': computedFile.rules.length, 'has-error': computedFile.hasErrors, 'has-optimizations': computedFile.optimizations.length }" v-if="!computedFile.file.isDir">
        <div class="ComputedFile-relativePath ComputedFile-relativePath--originalFile">
            <File :file="computedFile.file" />
        </div>
        <div class="ComputedFile-toggler">
            <button class="ComputedFile-togglerButton" @click="isOpen = !isOpen"> {{ computedFile.rules.length }}
                <Error align="block" message="" v-if="computedFile.hasErrors && !isOpen" />
            </button>
        </div>
        <div>
            <div class="ComputedFile-rulesAndOptimizations ComputedFile-rulesAndOptimizations--ruleDefs">
                <div class="ComputedFile-rule">
                    <template v-if="isOpen || (!computedFile.rules.length && !isOpen)">
                        <button class="ComputedFile-ruleDefsOpener">+</button>
                        <div class="ComputedFile-ruleDefs">
                            <button v-for="ruleDef in computedFile.ruleDefs" :key="ruleDef.ruleName" @click="handleRuleDefClick(ruleDef)"> + {{ ruleDef.ruleName }} </button>
                        </div>
                    </template>
                </div>
                <div class="ComputedFile-optimizations">
                    <div class="ComputedFile-relativePath ComputedFile-relativePath--optimization" v-for="optimization in computedFile.optimizations" v-if="!isOpen" :key="optimization.id">
                        <Optimization :optimization="optimization" />
                    </div>
                </div>
            </div>
            <div class="ComputedFile-rulesAndOptimizations" :class="{ 'has-error': rule.state === 'error' }" v-for="rule in computedFile.rules" :key="rule.id" v-if="isOpen">
                <div class="ComputedFile-rule">
                    <span class="ComputedFile-ruleName">
                        <div class="ComputedFile-ruleControls">
                            <button class="ComputedFile-reset" @click="emit('resetRule', rule.id)">R</button>
                            <button class="ComputedFile-delete" @click="emit('deleteRule', rule.id)" :disabled="!!rule.presetRuleId">-</button>
                        </div>
                        <span>{{ rule.ruleName }}</span>
                    </span>
                    <span> {{ rule.state ? `${STATE_MESSAGES[rule.state]}` : `` }} </span>
                    <component :is="RULE_DEFS_BY_NAME[rule.ruleName]?.component" :data="rule.data" @change="(data: any) => handleRuleChange({ ...rule, data })" />
                    <Error align="block" v-if="rule.state === 'error' && rule.error" :message="rule.error" />
                </div>
                <div class="ComputedFile-optimizations">
                    <div class="ComputedFile-relativePath ComputedFile-relativePath--optimization" v-for="optimization in computedFile.optimizations.filter(optimization => optimization.ruleId === rule.id)" :key="optimization.id">
                        <Optimization :optimization="optimization" />
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
import Error from './Error.vue'
import File from './File.vue'
import Optimization from './Optimization.vue'
import { AssetOptimizerOptimization, AssetOptimizerFile, AssetOptimizerRule, AssetOptimizerRuleDef } from '@/types'
import { computed, defineAsyncComponent, ref } from 'vue'

export type ComputedRuleDef = {
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
    (event: 'optimizationEnter', id: number): void
    (event: 'optimizationLeave', id: number): void
}>()


const isOpen = ref(false)
</script>

<style lang="stylus">
line(direction = 'horizontal')
    content ''
    background #ddd
    height 1px
    margin-top .9em

.ComputedFile
    display grid
    grid-template-columns 400px 70px 1fr

    &-relativePath
        &--originalFile
            display flex
            align-items flex-start

            &:after
                line()
                flex 1 1 30px

        &--optimization
            display flex
            align-items flex-start

            &:before
                line()
                flex 1 1 30px

    &-toggler
        display flex
        align-items flex-start

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
        color #ddd

        &:hover
            background #f4f4f4
            color #000

    &-rulesAndOptimizations
        position relative
        display grid
        grid-template-columns 1fr 400px

        &:not(:last-child)
            &:before
                content ''
                position absolute
                top .9em
                bottom -.9em
                background #ddd
                width 1px

        &.has-error
            .ComputedFile-rule
                &:after
                    content none

    &-rule
        display flex
        align-items flex-start
        flex 1 1 0px
        white-space nowrap
        gap 10px

        &:before
            line()
            flex 0 0 30px

        &:after
            line()
            flex 1 1 30px

        &:not(:hover)
            .ComputedFile-ruleDefs
                display none

    &-optimizations
        position relative
        white-space nowrap

        &:before
            content ''
            position absolute
            top .9em
            bottom 1em
            background #ddd
            width 1px

    &-optimization
        display flex
        align-items flex-start

        &:before
            line()
            flex 1 1 30px

    &-ruleDefs
        display flex
        gap 3px
        margin-left -38px

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
            .ComputedFile-ruleControls
                display none

    &-ruleControls
        display inline-flex
        gap 2px
        margin-right 10px

        button
            background: var(--color-accent);
            color: var(--color-accent-invert);
            border-radius var(--border-radius)
            cursor pointer
            width 24px
            height 24px

            &:disabled
                cursor not-allowed
                background #ddd

    &:hover
        .ComputedFile-relativePath
            span
                overflow-x auto

    &.is-open
        padding-bottom 10px

        .ComputedFile-rulesAndOptimizations--ruleDefs
            padding-bottom 10px

        .ComputedFile-toggler
            &:before
                content none

    &:not(.has-optimizations),
    &.is-open
        .ComputedFile-rulesAndOptimizations--ruleDefs
            .ComputedFile-rule
                &:after
                    content none

    &.has-rules:not(.has-optimizations):not(.is-open)
        .ComputedFile-toggler
            &:after
                content none

    &.has-rules:not(.is-open)
        .ComputedFile-rule
            &:before
                content none

    &:not(.has-rules)
        .ComputedFile-togglerButton
            display none
</style>