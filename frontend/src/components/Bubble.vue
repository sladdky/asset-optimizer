<template>
    <div class="Bubble" :style="{ top: `${floaterProps.top}px`, left: `${floaterProps.left}px`, position: floaterProps.position }" v-show="bubble.isVisible" ref="floatingEl">
        <div class="Bubble-content" v-html="bubble.content"></div>
        <div class="Bubble-arrow" ref="arrowEl" :style="{ top: arrowProps.top ? `${arrowProps.top}px` : ``, left: arrowProps.left ? `${arrowProps.left}px` : `` , right: arrowProps.right ? `${arrowProps.right}px` : `` , bottom: arrowProps.bottom ? `${arrowProps.bottom}px` : `` }"></div>
    </div>
</template>

<script lang="ts" setup>
import { useBubble } from '@/hooks/useBubble'
import { reactive, ref, watch } from 'vue'
import { computePosition, flip, arrow } from '@floating-ui/dom'

type FloaterProps = {
    top: number
    left: number
    position: 'absolute' | 'fixed'
}

type ArrowProps = {
    top?: number,
    left?: number,
    right?: number,
    bottom?: number
}

const floaterProps = reactive<FloaterProps>({
    top: 0,
    left: 0,
    position: 'absolute'
})
const arrowProps = reactive<ArrowProps>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
})

const floatingEl = ref<HTMLElement>()
const arrowEl = ref<HTMLElement>()

const { bubble } = useBubble()
watch(bubble, async () => {
    if (!floatingEl.value || !arrowEl.value) {
        return
    }

    const { x, y, strategy, middlewareData, placement } = await computePosition(bubble.anchorEl, floatingEl.value, {
        placement: bubble.placement,
        middleware: [flip(), arrow({
            element: arrowEl.value
        })]
    })

    floaterProps.top = y
    floaterProps.left = x
    floaterProps.position = strategy

    const side = placement.split("-")[0] as 'right' | 'top' | 'left' | 'bottom'

    const staticSide = ({
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
    } as const)[side]

    const arrowLen = arrowEl.value.offsetWidth
    arrowProps.top = middlewareData.arrow?.y
    arrowProps.left = middlewareData.arrow?.x
    arrowProps[staticSide] = -arrowLen / 2
})
</script>

<style lang="stylus" scoped>
.Bubble
    z-index 99999
    pointer-events none
    filter drop-shadow(0 0 10px rgba(#000, .3))

    &-content
        max-width 200px
        border-radius var(--border-radius)
        padding 10px
        background #fff

    &-arrow
        position absolute
        width 10px
        height 10px
        background #fff
        transform rotate(45deg)
</style>