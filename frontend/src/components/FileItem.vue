<template>
    <article class="FileItem" :class="{ 'is-rulesetup-open': isRuleSetupOpen, 'has-rules': computedFile.rules.length }" v-if="!computedFile.isDir">
        <strong class="FileItem-relativePath FileItem-relativePath--originalFile">
            <span>{{ computedFile.relativePath }}</span>
        </strong>
        <div class="FileItem-ruleSetup">
            <div class="FileItem-rulesAndOptimizations">
                <div class="FileItem-rule FileItem-rule--opener">
                    <button class="FileItem-ruleSetupOpener" @click="isRuleSetupOpen = !isRuleSetupOpen"> {{ computedFile.rules.length ? computedFile.rules.length : isRuleSetupVisible ? '-' : '+' }} </button>
                </div>
                <div class="FileItem-optimizations">
                    <strong class="FileItem-relativePath FileItem-relativePath--optimization" v-for="optimization in computedFile.rules.reduce<AssetOptimizerOptimization[]>((acc, rule) => { acc.push(...rule.optimizations); return acc }, [])" :key="optimization.id" v-if="!isRuleSetupVisible">
                        <span>{{ computedFile.relativePath }}</span>
                    </strong>
                </div>
            </div>
            <div class="FileItem-rulesAndOptimizations" v-for="rule in computedFile.rules" :key="rule.id" v-if="isRuleSetupVisible">
                <div class="FileItem-rule"> {{ rule.ruleDefName }} {{ rule.state ? `${STATE_MESSAGES[rule.state]}` : '' }} </div>
                <div class="FileItem-optimizations">
                    <strong class="FileItem-relativePath FileItem-relativePath--optimization" v-for="optimization in rule.optimizations" :key="optimization.id">
                        <span>{{ computedFile.relativePath }}</span>
                    </strong>
                </div>
            </div>
            <div class="FileItem-rulesAndOptimizations" v-if="isRuleSetupVisible">
                <div class="FileItem-rule FileItem-rule--ruleDefs">
                    <div class="FileItem-ruleDefs">
                        <button v-for="ruleDef in computedFile.ruleDefs" :key="ruleDef.name" @click="handleRuleDefClick(ruleDef)"> + {{ ruleDef.displayName }} </button>
                    </div>
                </div>
                <div class="FileItem-optimizations"> </div>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
import { AssetOptimizerOptimization, AssetOptimizerFile, AssetOptimizerRule, AssetOptimizerUiRuleDef } from '@/types'
import { computed, ref } from 'vue'

type ComputedRule = {
    optimizations: AssetOptimizerOptimization[]
} & AssetOptimizerRule

export type ComputedRuleDef = {
    displayName: string
    name: string,
} & AssetOptimizerUiRuleDef

export type ComputedFile = {
    rules: ComputedRule[]
    ruleDefs: ComputedRuleDef[]
} & AssetOptimizerFile

const props = defineProps<{
    computedFile: ComputedFile
}
>()

const STATE_MESSAGES: Record<string, string> = {
    queued: '(queued)',
    optimizing: '(optimizing...)',
    optimized: ''
}

const handleRuleDefClick = (ruleDef: AssetOptimizerUiRuleDef) => {
    emit('addRule', {
        fileId: props.computedFile.id,
        fileRelativePath: props.computedFile.relativePath,
        ruleDefName: ruleDef.name,
    })
}

const emit = defineEmits<{
    (event: 'addRule', rule: Omit<AssetOptimizerRule, 'id'>): void
}>()

const isRuleSetupOpen = ref(false)
const isRuleSetupVisible = computed(() => !props.computedFile.isDir && isRuleSetupOpen.value && (props.computedFile.rules.length || props.computedFile.ruleDefs.length))
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
            overflow-y hidden
            overflow-x scroll
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


    &-ruleSetupOpener
        padding 5px 10px
        display flex
        align-items center
        justify-content center
        background none
        cursor pointer

        &:hover
            background #f4f4f4

        &--black
            background #e10
            color #fff

            &:hover
                background #c00

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

        button
            padding 3px 10px
            background #000
            color #fff
            cursor pointer

    &.is-rulesetup-open
        margin-bottom 30px

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
    &.has-rules
        .FileItem-ruleSetupOpener
            opacity .2

    &:not(.has-rules):not(.is-rulesetup-open)
        .FileItem-ruleSetupOpener
            background #f00
            color #fff

</style>