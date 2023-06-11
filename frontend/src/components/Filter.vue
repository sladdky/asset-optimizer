<template>
    <div class="Filter">
        <input type="text" placeholder="Search" v-model="filter.fileRelativePath">
        <div>
            <button class="Filter-presetOpener" @click="handlePresetClick">Presets</button>
        </div>
        <input type="text" placeholder="Search" v-model="filter.optimizationRelativePath">
    </div>
</template>

<script lang="ts" setup>
import { useFilter } from '@/hooks/useFilter'

const {filter} = useFilter()

const handlePresetClick = () => {
    filter.isPresetsOpen = !filter.isPresetsOpen
}
</script>

<style lang="stylus" scoped>
.Filter
    display flex
    justify-content space-between
    position sticky
    z-index 1
    top 0
    padding 10px 15px
    background var(--color-primary)
    color var(--color-primary-invert)

    &-presetOpener
        background var(--color-primary-100)
        color var(--color-primary-invert-100)
        cursor pointer

</style>