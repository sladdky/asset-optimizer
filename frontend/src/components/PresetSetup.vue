<template>
    <div class="PresetSetup">
        <PresetForm class="PresetSetup-form" :rule-defs="ruleDefs" />
        <PresetList />
    </div>
</template>

<script lang="ts" setup>
import PresetForm from './PresetForm.vue'
import PresetList from './PresetList.vue'
import { useSocket } from '@/shared-hooks'
import { AssetOptimizerRuleDef } from '@/types'
import { ref } from 'vue'

const ruleDefs = ref<AssetOptimizerRuleDef[]>([])

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
.PresetSetup
    display block

    &-form
        margin-bottom 10px


</style>