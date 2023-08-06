<template>
    <div class="ComputedFileList">
        <ComputedFileProvider v-for="file in files" :key="file.id" :file="file" :optimizations="allOptimizations" :rules="allRules" :ruleDefs="allRuleDefs" v-slot="{ computedFile }" v-if="filesWithoutDirs">
            <ComputedFile class="ComputedFileList-item" :computedFile="computedFile" @addRule="handleComputedFileAddRule" @deleteRule="handleComputedFileDeleteRule" @updateRule="handleComputedFileUpdateRule" @resetRule="handleComputedFileResetRule" />
        </ComputedFileProvider>
        <div class="ComputedFileList-noResult" v-if="!filesWithoutDirs && !isFilterInDefaultState">Nothing found. :(</div>
        <div class="ComputedFileList-noResult" v-if="!filesWithoutDirs && isFilterInDefaultState"> Source folder is empty!<br> Drop files here or in your source folder. </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import ComputedFileProvider from './ComputedFileProvider.vue'
import ComputedFile from './ComputedFile.vue'
import { AssetOptimizerFile, AssetOptimizerOptimization, AssetOptimizerRule, AssetOptimizerRuleDef } from '@/types'
import { useSocket, useFilter } from '@/shared-hooks'

const allRuleDefs = ref<AssetOptimizerRuleDef[]>([])
const allFiles = ref<AssetOptimizerFile[]>([])
const allRules = ref<AssetOptimizerRule[]>([])
const allOptimizations = ref<AssetOptimizerOptimization[]>([])

const { filter, isFilterInDefaultState } = useFilter()
const files = computed(() => {
    let _files = allFiles.value

    if (filter.fileRelativePath) {
        _files = _files.filter(file => file.relativePath.includes(filter.fileRelativePath))
    }

    if (filter.optimizationRelativePath) {
        const fileIds = allOptimizations.value.filter(optimization => optimization.relativePath.includes(filter.optimizationRelativePath)).map(optimization => optimization.fileId)
        _files = _files.filter(file => fileIds.includes(file.id))
    }

    return _files
})
const filesWithoutDirs = computed(() => files.value.filter(file => !file.isDir).length)

const { socket, onConnected } = useSocket()

const handleComputedFileAddRule = (rule: Omit<AssetOptimizerRule, 'id'>) => {
    socket.emit('rule:create', rule)
}

const handleComputedFileDeleteRule = (id: number) => {
    socket.emit('rule:delete', id)
}

const handleComputedFileUpdateRule = (rule: AssetOptimizerRule) => {
    socket.emit('rule:update', rule)
}

const handleComputedFileResetRule = (id: number) => {
    socket.emit('rule:reset', id)
}

socket.on('file:created', (file) => {
    allFiles.value.push(file)
})

socket.on('file:deleted', (file) => {
    const index = allFiles.value.findIndex(_file => _file.relativePath === file.relativePath)
    if (index >= 0) {
        allFiles.value.splice(index, 1)
    }
})

socket.on('rule:created', (rule) => {
    allRules.value.push(rule)
})
socket.on('rule:updated', (rule) => {
    const index = allRules.value.findIndex(_rule => _rule.id === rule.id)
    if (index >= 0) {
        allRules.value[index] = rule
    }
})
socket.on('rule:deleted', (rule) => {
    const index = allRules.value.findIndex(_rule => _rule.id === rule.id)
    if (index >= 0) {
        allRules.value.splice(index, 1)
    }
})


socket.on('optimization:created', (optimization) => {
    allOptimizations.value.push(optimization)
})

socket.on('optimization:deleted', (optimization) => {
    const index = allOptimizations.value.findIndex(_optimization => _optimization.id === optimization.id)
    if (index >= 0) {
        allOptimizations.value.splice(index, 1)
    }
})

onConnected(() => {
    socket.emit("ruledef:list", (res) => {
        if ("error" in res) {
            return
        }
        allRuleDefs.value = res.data
    })

    socket.emit("file:list", (res) => {
        if ("error" in res) {
            return
        }
        allFiles.value = res.data
    })

    socket.emit("rule:list", (res) => {
        if ("error" in res) {
            return
        }
        allRules.value = res.data
    })

    socket.emit("optimization:list", (res) => {
        if ("error" in res) {
            return
        }
        allOptimizations.value = res.data
    })
})
</script>

<style lang="stylus" scoped>
.ComputedFileList
    padding 20px
    .ComputedFile
        margin-bottom 2px

    &-noResult
        display flex
        justify-content center
        align-items center
        height 80vh
        text-align center
</style>