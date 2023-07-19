<template>
    <div class="UploaderDropzone">
        <input type="file" @change="handleChange" multiple>
        Upload files
    </div>
</template>

<script lang="ts" setup>
import { useUploader } from '@/shared-hooks'

const { addFiles } = useUploader()

const handleChange = (event: Event) => {
    const element = event.currentTarget as HTMLInputElement
    if (element.files) {
        addFiles([...element.files])
    }
    element.value = ''
}
</script>

<style lang="stylus" scoped>
.UploaderDropzone
    display block
    position relative
    border 2px dashed black
    display flex
    align-items center
    justify-content center
    padding 50px
    margin 50px

    input
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        opacity 0
</style>