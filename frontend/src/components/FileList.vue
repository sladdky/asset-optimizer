<template>
    <div class="FileList">
        <ul>
            <li v-for="(file, key) in files" :key="key">{{ key }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { AssetOptimizerFile, WS_MESSAGE, WS_MESSAGE_CALLBACKS, WS_MESSAGE_VALUES } from '@/_shared'
import { onMounted, ref } from 'vue'

const files = ref<Record<string, AssetOptimizerFile>>({})

onMounted(() => {
    const ws = new WebSocket('ws://localhost:3011')

    let CALLBACKS: WS_MESSAGE_CALLBACKS = {
        'filestore': (data) => {
            files.value = data.items
        },
    }

    const send = (message: WS_MESSAGE_VALUES) => {
        ws.send(JSON.stringify(message))
    }

    ws.addEventListener('message', (event) => {
        const message: WS_MESSAGE = JSON.parse(event.data.toString())
        CALLBACKS[message?.name]?.(message.data)
    })

    ws.addEventListener('open', () => {
        send({ name: 'request:filestore' })
    })
})

</script>

<style lang="stylus" scoped>
.FileList
    display block
    padding 20px
</style>