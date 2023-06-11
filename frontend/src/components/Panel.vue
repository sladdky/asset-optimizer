<template>
    <div class="Panel" v-if="isOpen">
        <PresetList v-if="filter.isPresetsOpen" />
        <PresetForm :rule-defs="ruleDefs" v-if="filter.isPresetsOpen" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import PresetForm from './PresetForm.vue'
import PresetList from './PresetList.vue'
import { AssetOptimizerRuleDef } from '../../../backend/src/types'
import { useSocket } from '@/hooks'
import { useFilter } from '@/hooks/useFilter'

const ruleDefs = ref<AssetOptimizerRuleDef[]>([])

const { filter } = useFilter()
const isOpen = computed(() => filter.isPresetsOpen ? true : false)


const { socket, onConnected } = useSocket()

onConnected(() => {
    socket.emit("ruledef:list", (res) => {
        if ("error" in res) {
            return
        }
        ruleDefs.value = res.data
    })
})

</script>

<style lang="stylus" scoped>
.Panel
    display block
    position sticky
    z-index 1
    top 42px
    padding 30px 0
    margin 10px 10px 50px
    background var(--color-primary-100)
    border 2px solid var(--color-primary)

</style>