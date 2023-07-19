<template>
    <header class="Header">
        ASSET-OPTIMIZER
        <button class="Header-presetOpener" @click="handlePresetClick">Presets</button>
    </header>
</template>

<script lang="ts" setup>
import { usePresetSetup } from '@/shared-hooks'


const { presetsetup } = usePresetSetup()

const handlePresetClick = () => {
    presetsetup.isOpen = !presetsetup.isOpen
}
</script>

<style scoped lang="stylus">
.Header
    padding 17px 0 0
    margin-bottom -5px
    font-family 'WorkSans'
    font-weight 700
    text-align center
    background var(--color-primary)
    color var(--color-primary-300)
    position relative
    z-index 2

    &-presetOpener
        background var(--color-primary-100)
        color var(--color-primary-invert-100)
        cursor pointer
        padding 2px 10px
        margin-left 10px
        border-radius var(--border-radius)
</style>