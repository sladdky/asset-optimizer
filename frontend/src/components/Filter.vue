<template>
    <div class="Filter">
        <input type="text" placeholder="Search" v-model="filter.fileRelativePath">
        <input type="text" placeholder="Search" v-model="filter.optimizationRelativePath">
    </div>
</template>

<script lang="ts" setup>
import { useFilter } from '@/hooks/useFilter'

const { filter } = useFilter()

</script>

<style lang="stylus" scoped>
.Filter
    display flex
    justify-content space-between
    position sticky
    z-index 1
    top 0
    padding 15px
    background var(--color-primary)
    color var(--color-primary-invert)

    input
        border-radius var(--border-radius)
        padding 2px 10px
        background var(--color-primary-100)
        color var(--color-primary-invert-600)

        &::placeholder
            color var(--color-primary)

</style>