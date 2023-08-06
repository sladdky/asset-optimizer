<template>
    <div class="GlobalLoader" v-if="!isConnected"> ASSET-OPTIMIZER <div class="GlobalLoader-spinner"></div> Cannot connect to the backend service. Is it running? </div>
</template>

<script lang="ts" setup>
import { useSocket } from '@/shared-hooks'
import { ref } from 'vue'

const { socket } = useSocket()

const isConnected = ref(socket.connected)

socket.on('disconnect', () => {
    isConnected.value = false
})
socket.on('connect', () => {
    isConnected.value = true
})

</script>

<style lang="stylus" scoped>
.GlobalLoader
    display flex
    align-items center
    justify-content center
    flex-flow column
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background #000
    z-index 9999
    color #fff
    padding 17px 20px
    font-family 'WorkSans'
    font-weight 700
    font-size 20px

    &-spinner
        border 8px solid rgba(#fff, 0.1)
        border-left-color #fff
        border-radius 50%
        width 80px
        height 80px
        margin 20px
        animation spin 2s linear infinite;

@keyframes spin
    0%
        transform rotate(0deg)

    100%
        transform rotate(360deg)


</style>