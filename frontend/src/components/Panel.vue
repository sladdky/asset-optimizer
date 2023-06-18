<template>
    <div class="Panel" v-if="isOpen">
        <PresetForm :rule-defs="ruleDefs" v-if="filter.isPresetsOpen" />
        <PresetList v-if="filter.isPresetsOpen" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import PresetForm from './PresetForm.vue'
import PresetList from './PresetList.vue'
import { AssetOptimizerRuleDef } from '@/types'
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
    display flex
    flex-flow column
    gap 10px
    position sticky
    z-index 1
    top 55px
    padding 30px 20px
    margin 0 0 50px
    background var(--color-primary-400)

</style>