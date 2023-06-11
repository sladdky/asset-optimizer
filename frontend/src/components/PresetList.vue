<template>
    <div class="PresetList">
        <PresetItemProvider v-for="preset in allPresets" :key="preset.id" :preset="preset" :presetRules="allPresetRules" :ruleDefs="allRuleDefs" v-slot="{ computedPreset }">
            <PresetItem :computedPreset="computedPreset" @updatePreset="handlePresetItemUpdatePreset" @deletePreset="handlePresetItemDeletePreset" @addPresetRule="handlePresetItemAddPresetRule" @deletePresetRule="handlePresetItemDeletePresetRule" @updatePresetRule="handlePresetItemUpdatePresetRule" />
        </PresetItemProvider>
    </div>
</template>

<script lang="ts" setup>
import PresetItemProvider from './PresetItemProvider.vue'
import PresetItem from './PresetItem.vue'
import { useSocket } from '@/hooks'
import { AssetOptimizerPreset, AssetOptimizerPresetRule, AssetOptimizerRuleDef } from '@/types'
import { ref } from 'vue'

const allRuleDefs = ref<AssetOptimizerRuleDef[]>([])
const allPresetRules = ref<AssetOptimizerPresetRule[]>([])
const allPresets = ref<AssetOptimizerPreset[]>([])

const { socket, onConnected } = useSocket()

socket.on('preset:created', (preset) => {
    allPresets.value.push(preset)
})

socket.on('preset:updated', (preset) => {
    const index = allPresets.value.findIndex(_preset => _preset.id === preset.id)
    if (index >= 0) {
        allPresets.value[index] = preset
    }
})

socket.on('preset:deleted', (preset) => {
    const index = allPresets.value.findIndex(_preset => _preset.id === preset.id)
    if (index >= 0) {
        allPresets.value.splice(index, 1)
    }
})
socket.on('presetrule:created', (presetRules) => {
    allPresetRules.value.push(presetRules)
})

socket.on('presetrule:updated', (presetRule) => {
    const index = allPresetRules.value.findIndex(_presetRule => _presetRule.id === presetRule.id)
    if (index >= 0) {
        allPresetRules.value[index] = presetRule
    }
})

socket.on('presetrule:deleted', (presetRule) => {
    const index = allPresetRules.value.findIndex(_presetRule => _presetRule.id === presetRule.id)
    if (index >= 0) {
        allPresetRules.value.splice(index, 1)
    }
})

onConnected(() => {
    socket.emit("preset:list", (res) => {
        if ("error" in res) {
            return
        }
        allPresets.value = res.data
    })
    socket.emit("ruledef:list", (res) => {
        if ("error" in res) {
            return
        }
        allRuleDefs.value = res.data
    })
    socket.emit("presetrule:list", (res) => {
        if ("error" in res) {
            return
        }
        allPresetRules.value = res.data
    })
})


const handlePresetItemUpdatePreset = (preset: AssetOptimizerPreset) => {
    socket.emit('preset:update', preset)
}
const handlePresetItemDeletePreset = (id: number) => {
    socket.emit('preset:delete', id)
}
const handlePresetItemAddPresetRule = (presetRule: Omit<AssetOptimizerPresetRule, 'id'>) => {
    socket.emit('presetrule:create', presetRule)
}
const handlePresetItemDeletePresetRule = (id: number) => {
    socket.emit('presetrule:delete', id)
}
const handlePresetItemUpdatePresetRule = (presetRule: AssetOptimizerPresetRule) => {
    socket.emit('presetrule:update', presetRule)
}

</script>

<style lang="stylus" scoped>
.PresetList
    .PresetItem
        margin-bottom 2px
</style>