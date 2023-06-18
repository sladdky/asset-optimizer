<template>
    <div class="FileRelativePath" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="rootEl"> <span>{{ file.relativePath }}</span> </div>
</template>

<script lang="ts" setup>
import { useSocket, useBubble } from '@/hooks'
import { AssetOptimizerFile } from '@/types'
import { ref } from 'vue'

const { bubble } = useBubble()
const rootEl = ref<HTMLElement>()

const props = defineProps<{
    file: AssetOptimizerFile
}>()

const handleMouseEnter = () => {
    const { socket, onConnected } = useSocket()
    onConnected(() => {
        socket.emit('file:previewimage', props.file.id, (res) => {
            if ("error" in res) {
                return
            }
            if (!rootEl.value) {
                return
            }

            const base64 = res.data
            bubble.content = `<img src="${base64}"/>`
            bubble.anchorEl = rootEl.value
            bubble.placement = 'right'
            bubble.show()
        })
    })
}

const handleMouseLeave = () => {
    bubble.hide()
}

</script>

<style lang="stylus" scoped>
.FileRelativePath
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
</style>