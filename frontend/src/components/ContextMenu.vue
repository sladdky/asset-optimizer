<template>
    <div class="ContextMenu">
        <div class="ContextMenu-inner">
            <div class="ContextMenu-controls">
                <button class="ContextMenu-delete" v-if="sourceCountsByType['AoFile']" @click="handleAoFileDeleteClick">Delete files ({{ sourceCountsByType['AoFile'] }})</button>
                <button class="ContextMenu-download" :class="{ 'is-loading': isAoFileDownloadLoading }" v-if="sourceCountsByType['AoFile']" @click="handleAoFileDownloadClick">Download files ({{ sourceCountsByType['AoFile'] }})</button>
                <button class="ContextMenu-download" :class="{ 'is-loading': isOptimizationDownloadLoading }" v-if="sourceCountsByType['Optimization']" @click="handleOptimizationDownloadClick">Download optimizations ({{ sourceCountsByType['Optimization'] }})</button>
            </div>
            <span> {{ contextmenu.sources.length }} items selected <button @click="handleDeselectClick">deselect</button> </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useContextMenu, useSocket } from '@/hooks'
import { ContextMenuSourceTypes } from '@/hooks/useContextMenu'
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
    'Unkown': 0,
    'Optimization': 0,
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
</style>