<template>
    <div class="Panel" v-if="isVisible">
        <Filter v-if="isFilterOpen" />
        <PresetSetup v-if="isPresetSetupOpen" />
        <UploaderList v-if="isUploaderOpen" />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PresetSetup from './PresetSetup.vue'
import { usePresetSetup, useFilter } from '@/shared-hooks'
import UploaderList from './UploaderList.vue'
import Filter from './Filter.vue'
import { useUploader } from '@/modules/uploader'

const { isFilterOpen } = useFilter()
const { isUploaderOpen } = useUploader()
const { isPresetSetupOpen } = usePresetSetup()

const isVisible = computed(() => isFilterOpen.value || isPresetSetupOpen.value || isUploaderOpen.value)
</script>

<style lang="stylus" scoped>
.Panel
    display flex
    flex-flow column
    position sticky
    z-index 1
    top 0
    margin 0 0 50px
    background var(--color-primary-400)

    &-item
        border-bottom 1px solid #000
</style>