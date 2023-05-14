<template>
    <div>
        <Header></Header>
        <FileList></FileList>
    </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
import FileList from './components/FileList.vue'

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

    @media $large-up
        font-size 1.7rem

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
</style>
