<template>
    <span class="Error" :class="{ [`Error--${props.align}`]: props.align }" :title="message"></span>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    align: {
        type: String as PropType<'block' | undefined>,
        required: false,
    }
})

</script>

<style lang="stylus" scoped>
.Error
    display inline-block
    text-align center
    width 1.8em
    margin-left 5px
    position relative
    z-index 0

    &:before
        content '!'
        width 1.8em
        height 1.8em
        top -.9em
        left 0
        font-weight bold
        position absolute
        z-index -1
        line-height 2em
        font-size .8em
        color #fff
        background red
        border-radius 50%

    &--block
        height 1.4em
        width 1.4em

        &:before
            top 0

</style>