<template>
    <div class="VideoCrop">
        <div class="VideoCrop-input VideoCrop-input--size">
            <input type="text" placeholder="(W)x(H)" v-model="data.size" ref="inputSizeEl">
            <select v-model="data.strategy">
                <option value="exact">exact</option>
                <option value="fit">fit</option>
            </select>
        </div>
        FPS:
        <div class="VideoCrop-input VideoCrop-input--fps">
            <input type="text" v-model="data.fps">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AssetOptimizerRuleDefs } from '@/types'
import debounce from 'lodash/debounce'
import { nextTick, ref, watch } from 'vue'

type Data = AssetOptimizerRuleDefs['videoCrop']['data']

const inputSizeEl = ref<HTMLElement>()

const props = defineProps<{
    data: any
}>()

const emit = defineEmits<{
    (event: 'change', value: Data): void
}>()

const data = ref<Data>({ size: '', strategy: 'exact', fps: 30 })

watch(props.data, () => {
    data.value = {
        size: '',
        strategy: 'exact',
        variants: [],
        ...props.data
    }
},
    {
        deep: true,
        immediate: true
    }
)

watch(data, () => {
    if (data.value === props.data) {
        return
    }
    emitChange()
}, {
    deep: true,
})


const emitChange = debounce(() => {
    emit('change', data.value)
}, 500)

</script>

<style lang="stylus" scoped>
.VideoCrop
    display flex
    flex-flow row wrap
    gap 3px

    &-input
        border 1px solid #000
        flex 1 1 0px
        display flex
        border-radius var(--border-radius)
        background #fff

        input
            flex 1 1 0px
            width 55px
            min-width 55px
            background none

        &--size
            min-width 180px

            input
                width 80px

        &--fps
            input
                width 40px

        button
            width 20px
            background var(--color-primary-100)
            color var(--color-primary-invert-100)

            &+&
                border-left 1px solid var(--color-primary-200)

    &-buttonDelete
        border-top-right-radius var(--border-radius)
        border-bottom-right-radius var(--border-radius)

    &-buttonAdd
        background var(--color-primary)
        color var(--color-primary-invert)
        border-radius var(--border-radius)

    &-buttonDefineSize
        min-width 230px
        background var(--color-primary-100)
        color var(--color-primary-invert-100)
        border-radius var(--border-radius)

    &-buttonEditor
        width auto !important

    &-variants
        display flex
        flex-flow column
        gap 3px
</style>