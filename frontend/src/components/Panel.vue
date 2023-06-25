<template>
    <div class="Panel" v-if="isVisible">
        <div class="Panel-item">
            <PresetSetup v-if="presetsetup.isOpen" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PresetSetup from './PresetSetup.vue'
import { usePresetSetup } from '@/hooks'

const { presetsetup } = usePresetSetup()

const isVisible = computed(() => presetsetup.isOpen)
</script>

<style lang="stylus" scoped>
.Panel
    display flex
    flex-flow column
    position sticky
    z-index 1
    top 55px
    margin 0 0 50px
    background var(--color-primary-400)

    &-item
        border-bottom 1px solid #000
</style>