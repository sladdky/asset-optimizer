<template>
    <div class="Optimization" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="rootEl" v-contextmenu="{ type: 'Optimization', id: optimization.id }"> <span>{{ optimization.relativePath }}</span> </div>
</template>

<script lang="ts" setup>
import { useSocket, useBubble, useContextMenu } from '@/shared-hooks'
import { AssetOptimizerOptimization } from '@/types'
import { ref } from 'vue'

const { bubble } = useBubble()
const rootEl = ref<HTMLElement>()

const props = defineProps<{
    optimization: AssetOptimizerOptimization
}>()

const { vContextmenu } = useContextMenu()

const { socket } = useSocket()
const handleMouseEnter = () => {
    socket.emit('optimization:previewimage', props.optimization.id, (res) => {
        if ("error" in res) {
            return
        }
        if (!rootEl.value) {
            return
        }

        const base64 = res.data
        bubble.content = `<img src="${base64}"/>`
        bubble.anchorEl = rootEl.value
        bubble.placement = 'left'
        bubble.show()
    })
}

const handleMouseLeave = () => {
    bubble.hide()
}

</script>

<style lang="stylus" scoped>
.Optimization
    overflow hidden
    display flex
    align-items flex-start
    white-space nowrap
    height 2em
    gap 10px

    span
        overflow hidden
        display block
        padding-bottom 20px
        display flex
        justify-content flex-end
</style>