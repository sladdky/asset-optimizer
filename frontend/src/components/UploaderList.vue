<template>
    <div class="UploaderList">
        <ul>
            <li v-for="ufile in uploader.ufiles.value"><button @click="handleRemoveClick(ufile.uid)">-</button> <Progress :progress="ufile.progress" /> {{ ufile.file.name }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import Progress from './Progress.vue'
import { useUploader } from '@/shared-hooks'

const { uploader } = useUploader()

const handleRemoveClick = (uid: string) => {
    uploader.removeUFileByUid(uid)
}
</script>

<style lang="stylus" scoped>
.UploaderList
    overflow-y auto
    overflow-x hidden
    padding 20px
    color #fff
    max-height 50vh

    button
        padding 3px 10px
        background var(--color-accent)
        color var(--color-primary-invert)
        border-radius var(--border-radius)
        cursor pointer

    li
        display flex
        align-items center
        gap 10px
</style>