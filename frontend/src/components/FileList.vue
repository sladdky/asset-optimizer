<template>
    <div class="FileList">
        <FileItemProvider v-for="file in files" :key="file.id" :file="file" :optimizations="allOptimizations" :rules="allRules" :ruleDefs="allRuleDefs" v-slot="{ computedFile }">
            <FileItem class="FileList-item" :computedFile="computedFile" @addRule="handleFileItemAddRule" @deleteRule="handleFileItemDeleteRule" @updateRule="handleFileItemUpdateRule" @resetRule="handleFileItemResetRule" />
        </FileItemProvider>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import FileItemProvider from './FileItemProvider.vue'
import FileItem from './FileItem.vue'
import { AssetOptimizerFile, AssetOptimizerOptimization, AssetOptimizerRule, AssetOptimizerRuleDef } from '@/types'
import { useSocket } from '@/hooks'
import { useFilter } from '@/hooks/useFilter'

const allRuleDefs = ref<AssetOptimizerRuleDef[]>([])
const allFiles = ref<AssetOptimizerFile[]>([])
const allRules = ref<AssetOptimizerRule[]>([])
const allOptimizations = ref<AssetOptimizerOptimization[]>([])

const { filter } = useFilter()
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

const { socket, onConnected } = useSocket()

const handleFileItemAddRule = (rule: Omit<AssetOptimizerRule, 'id'>) => {
    socket.emit('rule:create', rule)
}

const handleFileItemDeleteRule = (id: number) => {
    socket.emit('rule:delete', id)
}

const handleFileItemUpdateRule = (rule: AssetOptimizerRule) => {
    socket.emit('rule:update', rule)
}
const handleFileItemResetRule = (id: number) => {
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

    socket.emit("ruledef:list", (res) => {
        if ("error" in res) {
            return
        }
        allRuleDefs.value = res.data
    })
})
</script>

<style lang="stylus" scoped>
.FileList
    .FileItem
        margin-bottom 2px

</style>