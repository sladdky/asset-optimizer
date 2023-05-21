<template>
    <header class="Header">
        <div class="Header-sticky">
            <h1>ASSET-OPTIMIZER</h1>
            <div class="Header-filter">
                <input type="text" placeholder="Search" disabled>
                <div>
                    <button disabled>open</button> / <button disabled>collapse</button>
                </div>
                <input type="text" placeholder="Search" disabled>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="stylus">
.Header
    height 120px

    &-sticky
        padding 15px
        font-family 'WorkSans'
        font-weight bold
        text-align center
        background #000
        color #fff
        font-size 1rem
        position fixed
        z-index 1
        top 0
        left 0
        right 0

    &-filter
        display flex
        justify-content space-between

        [disabled]
            cursor not-allowed
</style>
