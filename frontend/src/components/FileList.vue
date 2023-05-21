<template>
    <div class="FileList">
        <FileItem class="FileList-item" v-for="computedFile in computedFiles" :key="computedFile.id" :computedFile="computedFile" @addRule="handleFileItemAddRule" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import FileItem, { ComputedFile } from './FileItem.vue'
import { io, Socket } from 'socket.io-client'
import { AssetOptimizerApiClientEvents, AssetOptimizerApiServerEvents, AssetOptimizerFile, AssetOptimizerOptimization, AssetOptimizerRule, AssetOptimizerUiRuleDef } from '@/types'

const ruleDefs = ref<AssetOptimizerUiRuleDef[]>([])
const files = ref<AssetOptimizerFile[]>([])
const rules = ref<AssetOptimizerRule[]>([])
const optimizations = ref<AssetOptimizerOptimization[]>([])

const computedFiles = computed<ComputedFile[]>(() => {
    return files.value.map(file => ({
        ...file,
        rules: rules.value.filter(rule => rule.fileId === file.id).map(rule => ({
            ...rule,
            optimizations: optimizations.value.filter(optimization => optimization.ruleId === rule.id)
        })),
        ruleDefs: ruleDefs.value.filter(ruleDef => file.ext.match(ruleDef.ext))
    }))
})

const socket: Socket<AssetOptimizerApiServerEvents, AssetOptimizerApiClientEvents> = io('ws://localhost:3011')

const handleFileItemAddRule = (rule: Omit<AssetOptimizerRule, 'id'>) => {
    socket?.emit('rule:create', rule)
}

socket.on("connect", () => {
    socket.emit("file:list", (res) => {
        if ("error" in res) {
            return
        }
        files.value = res.data
    })

    socket.on('file:created', (file) => {
        files.value.push(file)
    })

    socket.on('file:deleted', (file) => {
        const index = files.value.findIndex(_file => _file.relativePath === file.relativePath)
        if (index >= 0) {
            files.value.splice(index, 1)
        }
    })

    socket.emit("rule:list", (res) => {
        if ("error" in res) {
            return
        }
        rules.value = res.data
    })

    socket.on('rule:created', (rule) => {
        rules.value.push(rule)
    })
    socket.on('rule:updated', (rule) => {
        const index = rules.value.findIndex(_rule => _rule.id === rule.id)
        if (index >= 0) {
            rules.value[index] = rule
        }
    })
    socket.on('rule:deleted', (rule) => {
        const index = rules.value.findIndex(_rule => _rule.id === rule.id)
        if (index >= 0) {
            rules.value.splice(index, 1)
        }
    })

    socket.emit("optimization:list", (res) => {
        if ("error" in res) {
            return
        }
        optimizations.value = res.data
    })
    socket.on('optimization:created', (optimization) => {
        optimizations.value.push(optimization)
    })

    socket.on('optimization:deleted', (optimization) => {
        const index = optimizations.value.findIndex(_optimization => _optimization.id === optimization.id)
        if (index >= 0) {
            optimizations.value.splice(index, 1)
        }
    })

    socket.emit("ruledef:list", (res) => {
        if ("error" in res) {
            return
        }
        ruleDefs.value = res.data
    })
})


</script>

<style lang="stylus" scoped>
.FileList
    display flex
    flex-flow column
    gap 2px
</style>