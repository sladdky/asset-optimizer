<template>
    <header class="Header">
        <div class="Header-controls">
            <button class="Header-presetOpener" @click="handleUploadsClick">Uploads <span v-if="uploader.ufiles.value.length">({{ uploader.ufiles.value.length }})</span></button>
        </div>
        <h1>ASSET-OPTIMIZER</h1>
        <div class="Header-controls">
            <button class="Header-presetOpener" @click="handlePresetClick">Presets</button>
            <button class="Header-filterOpener" @click="handleFilterClick">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 70 60">
                    <path
                        d="M17.94 27.624h15.037c1.061 0 2.123.02 3.181-.025.553-.025 1.095.074 1.648.035.588-.042 1.18-.01 1.771-.01h5.272c.7 0 .679-.008.92-.654a9.296 9.296 0 0 1 7.897-6.434 9.442 9.442 0 0 1 10.287 6.68c.037.265.28.45.544.413 1.6-.011 3.198.006 4.797-.011.406 0 .562.114.555.537a105.961 105.961 0 0 0 0 3.716c.007.429-.159.537-.558.532-1.527-.016-3.054.01-4.58-.014a.717.717 0 0 0-.83.58 9.526 9.526 0 0 1-9.16 6.603 9.515 9.515 0 0 1-8.95-6.601.72.72 0 0 0-.823-.584 39818.3 39818.3 0 0 1-43.991.01 4.047 4.047 0 0 0-.432 0c-.366.038-.504-.088-.496-.482.025-1.296.02-2.593 0-3.89 0-.324.08-.413.409-.412 5.833.012 11.667.016 17.502.01zm41.675 2.396a4.798 4.798 0 0 0-4.751-4.81 4.842 4.842 0 0 0-4.835 4.774 4.803 4.803 0 0 0 4.756 4.814 4.788 4.788 0 0 0 4.83-4.777z" />
                    <path
                        d="M54.58 52.808c-4.867 0-9.736.007-14.604-.008a.667.667 0 0 0-.759.542 9.258 9.258 0 0 1-6.994 6.387 9.176 9.176 0 0 1-8.812-2.53 9.009 9.009 0 0 1-2.39-3.938.559.559 0 0 0-.644-.458c-4.206.01-8.411.01-12.617.005-2.404 0-4.81-.007-7.214.007-.381 0-.525-.088-.519-.504a98.03 98.03 0 0 0-.012-3.888c-.008-.382.201-.384.461-.384h10.24c3.18 0 6.36-.006 9.54.01a.703.703 0 0 0 .802-.557 9.277 9.277 0 0 1 7.727-6.512 9.127 9.127 0 0 1 7.646 2.284 9.215 9.215 0 0 1 2.816 4.36c.118.385.36.42.685.42 2.737-.006 5.473-.006 8.209 0h20.827c.972 0 .871-.045.872.851v3.198l-.7.72zm-24.489 2.404a4.805 4.805 0 0 0 4.846-4.757 4.84 4.84 0 0 0-4.747-4.826 4.814 4.814 0 0 0-4.863 4.704 4.794 4.794 0 0 0 4.764 4.879z" />
                    <path
                        d="M48.748 11.934H29.996c-.62 0-1.24.02-1.857-.007a.54.54 0 0 0-.612.46 9.465 9.465 0 0 1-3.395 4.827 9.364 9.364 0 0 1-4.76 1.87 9.17 9.17 0 0 1-4.962-.835 9.353 9.353 0 0 1-5.076-5.754.7.7 0 0 0-.815-.575c-2.678.02-5.358 0-8.037.02-.407 0-.464-.122-.46-.484C.038 10.118.03 8.78 0 7.44c-.007-.325.179-.23.329-.23 2.722 0 5.444-.011 8.166.014a.74.74 0 0 0 .847-.601A9.337 9.337 0 0 1 17.382.08 8.895 8.895 0 0 1 23.2 1.303a9.374 9.374 0 0 1 4.278 5.319.75.75 0 0 0 .865.6 28943.2 28943.2 0 0 1 40.617-.01c.13.008.26.008.388 0 .38-.043.504.12.499.495a143.575 143.575 0 0 0 0 3.802c0 .344-.105.434-.447.433-4.68-.012-9.361-.015-14.041-.01zM23.212 9.598a4.864 4.864 0 0 0-4.836-4.84 4.809 4.809 0 0 0-4.744 4.827 4.783 4.783 0 0 0 4.794 4.808 4.847 4.847 0 0 0 4.786-4.795z" />
                </svg>
            </button>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useFilter, usePresetSetup, useUploader } from '@/shared-hooks'

const { isPresetSetupOpen } = usePresetSetup()
const { isFilterOpen } = useFilter()
const { isUploaderOpen, uploader } = useUploader()

const handlePresetClick = () => {
    isPresetSetupOpen.value = !isPresetSetupOpen.value
}

const handleFilterClick = () => {
    isFilterOpen.value = !isFilterOpen.value
}

const handleUploadsClick = () => {
    isUploaderOpen.value = !isUploaderOpen.value
}


</script>

<style scoped lang="stylus">
.Header
    padding 17px 20px
    font-family 'WorkSans'
    font-weight 700
    font-size 10px
    text-align center
    background var(--color-primary)
    color var(--color-primary-300)
    position relative
    z-index 2
    display flex
    justify-content space-between

    &-controls
        display flex
        gap 5px
        font-size 15px

    &-presetOpener
        background var(--color-primary-100)
        color var(--color-primary-invert-100)
        cursor pointer
        padding 2px 10px
        border-radius var(--border-radius)

    &-filterOpener
        cursor pointer
        padding 2px 10px
        border-radius var(--border-radius)

    &-uploadListOpener
        cursor pointer
        padding 2px 10px
        border-radius var(--border-radius)
</style>