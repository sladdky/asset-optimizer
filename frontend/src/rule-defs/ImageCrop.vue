<template>
    <div class="ImageCrop">
        <div v-if="isCropOpen || data.size">
            <div class="ImageCrop-input ImageCrop-input--size">
                <input type="text" placeholder="(W)x(H)" v-model="data.size" ref="inputSizeEl">
                <select v-model="data.strategy">
                    <option value="exact">exact</option>
                    <option value="fit">fit</option>
                    <option value="extract">custom</option>
                </select>
                <button class="ImageCrop-buttonEditor" v-if="data.strategy === 'extract'" @click="handleEditorClick"> editor </button>
                <button class="ImageCrop-buttonDelete" type="button" @click="handleCropClearClick">&times;</button>
            </div>
        </div>
        <div v-else>
            <button class="ImageCrop-buttonDefineSize" type="button" @click="handleDefineCropClick">custom dimensions</button>
        </div>
        <div class="ImageCrop-variants">
            <div v-for="(variant, index) in data.variants" :key="index">
                <div class="ImageCrop-input">
                    <input type="text" placeholder="(multiplier)x" v-model="data.variants[index]">
                    <button class="ImageCrop-buttonDelete" type="button" @click="handleVariantRemoveClick(index)">-</button>
                </div>
            </div>
        </div>
        <button class="ImageCrop-buttonAdd" type="button" @click="handleVariantAddClick">+</button>
    </div>
</template>

<script lang="ts" setup>
import { AssetOptimizerRuleDefs } from '@/types'
import debounce from 'lodash/debounce'
import { nextTick, ref, watch } from 'vue'

type Data = AssetOptimizerRuleDefs['imageCrop']['data']

const inputSizeEl = ref<HTMLElement>()
const isCropOpen = ref(false)

const handleDefineCropClick = () => {
    isCropOpen.value = true
    nextTick(() => {
        inputSizeEl.value?.focus()
    })
}

const handleCropClearClick = () => {
    data.value.size = ''
    delete data.value.extract
    isCropOpen.value = false
}

const props = defineProps<{
    data: any
}>()

const emit = defineEmits<{
    (event: 'change', value: Data): void
}>()

const data = ref<Data>({ size: '', strategy: 'exact', variants: [] })

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

const handleVariantAddClick = () => {
    const PREDICTIONS: Record<string, string> = {
        '1x': '2x',
        '2x': '0.5x',
        '0.5x': '0.25x',
    }

    let value = '1x'
    if (data.value.variants.length) {
        const prevValue = data.value.variants[data.value.variants.length - 1]
        value = PREDICTIONS[prevValue] ?? '1x'
    }
    data.value.variants.push(value)
}
const handleVariantRemoveClick = (index: number) => {
    data.value.variants.splice(index, 1)
}

const handleEditorClick = () => {
    alert('open editor')
}
</script>

<style lang="stylus" scoped>
.ImageCrop
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
            min-width 230px

            input
                width 80px

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