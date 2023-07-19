<template>
    <div class="UploaderList">
        <ul>
            <li v-for="ufile in ufiles"> {{ ufile.file.name }} <button @click="handleRemoveClick(ufile.uid)">-</button></li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { useUploader } from '@/shared-hooks'

const { ufiles, removeUFileByUid } = useUploader()
const handleRemoveClick = (uid: string) => {
    removeUFileByUid(uid)
}
</script>

<style lang="stylus" scoped>
.Upload
    display block
</style>