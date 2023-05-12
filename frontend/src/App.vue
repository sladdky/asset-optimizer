<template>
  <div>
    <h1>ASSET-OPTIMIZER</h1>
    <ul>
      <li v-for="(file, key) in files" :key="key">{{ key }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { WS_MESSAGE_CALLBACKS, WS_MESSAGE, WS_MESSAGE_VALUES } from '../../_shared/websockets'
import { AssetOptimizerFile } from '../../_shared/types'


const files = ref<Record<string, AssetOptimizerFile>>({})

onMounted(() => {
  const ws = new WebSocket('ws://localhost:3011')

  let CALLBACKS: WS_MESSAGE_CALLBACKS = {
    'filestore-items': (data) => {
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
    send({ name: 'request:filestore-items' })
  })
})
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  margin-top 60px
</style>
