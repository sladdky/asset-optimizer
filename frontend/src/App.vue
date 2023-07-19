<template>
    <div>
        <Header />
        <Filter />
        <Panel />
        <UploaderDropzone />
        <ComputedFileList />
        <Bubble />
        <ContextMenu v-if="contextmenu.sources.length" />
    </div>
</template>

<script lang="ts" setup>
import Panel from './components/Panel.vue'
import Filter from './components/Filter.vue'
import Header from './components/Header.vue'
import ComputedFileList from './components/ComputedFileList.vue'
import Bubble from './components/Bubble.vue'
import ContextMenu from './components/ContextMenu.vue'

import { useContextMenu } from '@/shared-hooks'
import UploaderDropzone from './components/UploaderDropzone.vue'

const { contextmenu } = useContextMenu()
</script>

<style lang="stylus">
@font-face
    font-family "WorkSans"
    src:
        url(./assets/fonts/worksans/worksans-semibold.woff) format("woff"),
        url(./assets/fonts/worksans/worksans-semibold.woff2) format("woff2")
    font-weight 400


@font-face
    font-family "WorkSans"
    src:
        url(./assets/fonts/worksans/worksans-bold.woff) format("woff"),
        url(./assets/fonts/worksans/worksans-bold.woff2) format("woff2")
    font-weight 700


@font-face
    font-family "Muli"
    src:
        url(./assets/fonts/muli/muli-semibold.woff) format("woff"),
        url(./assets/fonts/muli/muli-semibold.woff2) format("woff2")
    font-weight 400

:root
    --box-shadow 0 0 10px 0 rgba(#000, .3)
    --border-radius 4px
    --color-primary #17232b
    --color-primary-100 #ddd
    --color-primary-200 #d8e1eb
    --color-primary-300 #747b80
    --color-primary-400 #454f55
    --color-primary-500 #010101 //100%
    --color-primary-600 #121c22
    --color-primary-700 #0e151a
    --color-primary-800 #090e11
    --color-primary-900 #050709

    --color-primary-invert #e8e9ea
    --color-primary-invert-100 #000000
    --color-primary-invert-200 #050709
    --color-primary-invert-300 #ffffff
    --color-primary-invert-400 #ffffff
    --color-primary-invert-500 #e8e9ea //100%
    --color-primary-invert-600 #e8e9ea
    --color-primary-invert-700 #e8e9ea
    --color-primary-invert-800 #e8e9ea
    --color-primary-invert-900 #e8e9ea

    --color-accent #ac3d39
    --color-accent-invert #ffffff

    --color-success #3dac39
    --color-success-invert #ffffff


*, *:before, *:after
    box-sizing border-box
    background-repeat no-repeat

*
    font-variant-ligatures none
    font-feature-settings 'liga' 0
    -webkit-font-smoothing antialiased

html, body, h1, h2, h3, h4, h5, h6, p, ul, ol, li, dt, dl, dd, fieldset, figure, figcaption, blockquote
    margin 0
    padding 0

h1, h2, h3, h4
    line-height 1.2
    font-weight 700

ul, ol
    list-style none

b
    font-weight bold

abbr[title]
    text-decoration none

button, a
    touch-action manipulation

button, input, textarea
    font-size inherit
    font-family inherit
    box-shadow none
    border none

strong, b
    font-weight bold

input, textarea, button, select, label, a
    -webkit-tap-highlight-color rgba(0, 0, 0, 0)
    -webkit-tap-highlight-color transparent

img
    max-width 100%
    height auto
    display block

html
    font-size 62.5%

body
    font-size 1.5rem
    line-height: (23 / 15)
    font-family 'Muli'
    background #fff

p
    margin-bottom: (20 / 15em)

    &:last-child
        margin-bottom 0

a
    color inherit
    text-decoration underline

    &[href^=tel]
        text-decoration none
        color inherit

[data-contextmenu]
    user-select none
    cursor default
    padding 0 10px
    margin 0 -10px
    border 1px solid transparent

[data-contextmenu="selected"]
    background #eef
    border-color #00f
</style>