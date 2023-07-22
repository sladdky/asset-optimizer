<template>
    <div class="Progress">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 10.583 10.583">
            <circle cx="5.292" cy="5.292" r="4.536" fill="none" stroke="#c8c8c8" stroke-linejoin="bevel" stroke-width="1.455" />
            <path :style="{ strokeDashoffset: `${pathLength - progress * pathLength}px`, strokeDasharray: `${pathLength}px` }" fill="none" stroke="#000" stroke-linejoin="bevel" stroke-width="1.576" d="M9.795 5.292a4.504 4.504 0 0 1-4.503 4.503A4.504 4.504 0 0 1 .788 5.292 4.504 4.504 0 0 1 5.292.788a4.504 4.504 0 0 1 4.503 4.504Z" />
        </svg>
        {{ `${Math.round(progress*100)}%` }}
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    progress: number
}>()

const pathLength = 29
</script>

<style lang="stylus" scoped>
.Progress
    height 4em
    width 4em
    font-size .5em
    position relative
    display flex
    align-items center
    justify-content center
    line-height 1

    svg
        position absolute
        top 0
        left 0
        width 100%
        height 100%

</style>
