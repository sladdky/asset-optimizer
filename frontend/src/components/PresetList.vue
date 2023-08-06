<template>
    <div class="PresetList">
        <PresetItemProvider v-for="preset in allPresets" :key="preset.id" :preset="preset" :presetRules="allPresetRules" :ruleDefs="allRuleDefs" v-slot="{ computedPreset }" v-if="allPresets.length">
            <PresetItem :computedPreset="computedPreset" @deletePreset="handlePresetItemDeletePreset" @addPresetRule="handlePresetItemAddPresetRule" @deletePresetRule="handlePresetItemDeletePresetRule" @updatePresetRule="handlePresetItemUpdatePresetRule" />
        </PresetItemProvider>
        <div class="PresetList-noResult" v-else>
            <!-- #todo as tooltip and info icon -->
            No presets found.<br><br>
            Presets make it easier to handle optimization automatically.<br>
            1. Create a regex that will match every filename (including folders) in asset-optimizer.<br>
            2. Add optimization rules to the created preset.<br>
            3. Upload files to asset-optimizer. If the files match any regex, it will apply predefined rules.\
            <button @click="handleCreateDefaultPresetsClick">Create default presets</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PresetItemProvider from './PresetItemProvider.vue'
import PresetItem from './PresetItem.vue'
import { useSocket } from '@/shared-hooks'
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

const handleCreateDefaultPresetsClick = () => {
    socket.emit('other:createpresetdefaults')

}

</script>

<style lang="stylus" scoped>
.PresetList
    padding 0 20px 20px

    .PresetItem
        margin-bottom 2px
</style>