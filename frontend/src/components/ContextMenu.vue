<template>
    <div class="ContextMenu">
        <div class="ContextMenu-inner">
            <div class="ContextMenu-controls">
                <button class="ContextMenu-delete" v-if="sourceCountsByType['AoFile']" @click="handleAoFileDeleteClick">Delete files ({{ sourceCountsByType['AoFile'] }})</button>
                <button class="ContextMenu-download" :class="{ 'is-loading': isAoFileDownloadLoading }" v-if="sourceCountsByType['AoFile']" @click="handleAoFileDownloadClick">Download files ({{ sourceCountsByType['AoFile'] }})</button>
                <button class="ContextMenu-delete" v-if="sourceCountsByType['Rule']" @click="handleRuleDeleteClick">Delete rules ({{ sourceCountsByType['Rule'] }})</button>
                <button class="ContextMenu-delete" v-if="sourceCountsByType['Preset']" @click="handlePresetDeleteClick">Delete presets ({{ sourceCountsByType['Preset'] }})</button>
                <button class="ContextMenu-reset" v-if="sourceCountsByType['Preset']" @click="handlePresetRenameClick">Rename presets ({{ sourceCountsByType['Preset'] }})</button>
                <button class="ContextMenu-delete" v-if="sourceCountsByType['PresetRule']" @click="handlePresetRuleDeleteClick">Delete preset rules ({{ sourceCountsByType['PresetRule'] }})</button>
                <button class="ContextMenu-reset" v-if="sourceCountsByType['Rule']" @click="handleRuleResetClick">Reset rules ({{ sourceCountsByType['Rule'] }})</button>
                <button class="ContextMenu-download" :class="{ 'is-loading': isOptimizationDownloadLoading }" v-if="sourceCountsByType['Optimization']" @click="handleOptimizationDownloadClick">Download optimizations ({{ sourceCountsByType['Optimization'] }})</button>
            </div>
            <span> {{ contextmenu.sources.length }} items selected <button @click="handleDeselectClick">deselect</button> </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useContextMenu, useSocket } from '@/shared-hooks'
import { ContextMenuSourceTypes } from '@/shared-hooks/useContextMenu'
import { computed, ref } from 'vue'

const { contextmenu } = useContextMenu()
const { socket } = useSocket()
const sourceCountsByType = computed(() => contextmenu.sources.reduce<Record<ContextMenuSourceTypes, number>>((acc, source) => {
    const type = source.info.type
    if (!acc[type]) {
        acc[type] = 0
    }
    acc[type] += 1
    return acc
}, {
    'AoFile': 0,
    'Rule': 0,
    'Unkown': 0,
    'Optimization': 0,
    'PresetRule': 0,
    'Preset': 0,
}))


const isOptimizationDownloadLoading = ref(false)
const handleOptimizationDownloadClick = () => {
    const ids = contextmenu.sources
        .map(source => source.info.type === 'Optimization' ? source.info.id : null)
        .filter((source): source is number => source !== null)

    isOptimizationDownloadLoading.value = true
    socket.emit('optimization:downloadmany', ids, (res) => {
        isOptimizationDownloadLoading.value = false

        if ("error" in res) {
            return
        }

        const { url } = res.data

        const a = document.createElement('a')
        a.href = url,
            a.download = ''
        a.click()
        socket.disconnect()
        socket.connect()
    })
}

const handleAoFileDeleteClick = () => {
    //@todo: batch delete/delete-many

    if (window.confirm('Yo sure?')) {
        contextmenu.sources.forEach(source => {
            if (source.info.type === 'AoFile') {
                socket.emit('file:delete', source.info.id)
            }
        })
    }
}

const handlePresetDeleteClick = () => {
    if (window.confirm('Yo sure?')) {
        contextmenu.sources.forEach(source => {
            if (source.info.type === 'Preset') {
                socket.emit('preset:delete', source.info.id)
            }
        })
    }
}

const handlePresetRenameClick = () => {
    contextmenu.sources.forEach(source => {
        if (source.info.type === 'Preset') {
            const presetId = source.info.id
            const patternEl = source.el
            const pattern = patternEl.innerText
            const handleBlur = () => {
                finalize()
            }
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.code !== 'Enter') {
                    return
                }
                finalize()
            }
            const finalize = () => {
                patternEl.removeAttribute('contentEditable')
                patternEl.removeEventListener('blur', handleBlur)
                patternEl.removeEventListener('keydown', handleKeyDown)
                const newPattern = patternEl.innerText
                if (pattern !== newPattern) {
                    socket.emit('preset:renamepattern', presetId, newPattern)
                }
            }
            patternEl.setAttribute('contentEditable', 'true')
            patternEl.addEventListener('blur', handleBlur)
            patternEl.addEventListener('keydown', handleKeyDown)
            patternEl.focus()
        }
    })
}

const handlePresetRuleDeleteClick = () => {
    if (window.confirm('Yo sure?')) {
        contextmenu.sources.forEach(source => {
            if (source.info.type === 'PresetRule') {
                socket.emit('presetrule:delete', source.info.id)
            }
        })
    }
}

const handleRuleDeleteClick = () => {
    if (window.confirm('Yo sure?')) {
        contextmenu.sources.forEach(source => {
            if (source.info.type === 'Rule') {
                socket.emit('rule:delete', source.info.id)
            }
        })
    }
}

const handleRuleResetClick = () => {
    contextmenu.sources.forEach(source => {
        if (source.info.type === 'Rule') {
            socket.emit('rule:reset', source.info.id)
        }
    })
}

const isAoFileDownloadLoading = ref(false)
const handleAoFileDownloadClick = () => {
    const ids = contextmenu.sources
        .map(source => source.info.type === 'AoFile' ? source.info.id : null)
        .filter((source): source is number => source !== null)

    isAoFileDownloadLoading.value = true

    socket.emit('file:downloadmany', ids, (res) => {
        isAoFileDownloadLoading.value = false

        if ("error" in res) {
            return
        }

        const { url } = res.data

        const a = document.createElement('a')
        a.href = url
        a.download = ''
        a.click()
        socket.disconnect()
        socket.connect()
    })
}

const handleDeselectClick = () => {
    contextmenu.removeAllSources()
}

</script>

<style lang="stylus" scoped>
.ContextMenu
    height 150px

    &-inner
        position fixed
        left 0
        right 0
        bottom 0
        display flex
        justify-content space-between
        padding 15px 20px
        background var(--color-primary)
        color var(--color-primary-300)


    &-controls
        display flex
        gap 5px

        button
            padding 15px
            border-radius var(--border-radius)

            &.is-loading
                pointer-events none

                &:after
                    content '(...)'

    &-delete
        background var(--color-accent)
        color var(--color-accent-invert)

    &-download
        background var(--color-success)
        color var(--color-success-invert)

    &-reset
        background #ddd
        color #000
</style>