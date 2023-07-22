<template>
	<div class="FormSelect" :class="{
		'is-placeholder':
			value === '' && typeof value === 'undefined' && value === null
	}">
		<button class="FormSelect-opener" type="button" @click="isOpen = !isOpen"> {{ value !== '' && typeof value !== 'undefined' && value !== null ? options[value] : 'Choose' }} </button>
		<div class="FormSelect-list" v-if="isOpen">
			<div class="FormSelect-option" v-for="(label, value) of options" :key="value" :value="value" @click="handleOptionClick(value)"> {{ label }} </div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'

defineProps({
	value: {
		type: [Number, String] as PropType<string | number | null>
	},
	options: {
		type: Object as PropType<Record<string, string>>,
		default: () => ({}),
		required: true
	}
})

const emit = defineEmits<{
	(event: 'frmchange', value: string): void
}>()

const isOpen = ref(false)

const handleOptionClick = (value: string) => {
	emit('frmchange', value)
	isOpen.value = false
}

</script>

<style lang="stylus">
.FormSelect
	width 100%
	position relative
	text-align left
	color $black

	&-opener
		border 1px solid #eee
		background #eeeeee
		box-shadow none
		color $black
		padding 0
		border-radius 0
		margin 0
		line-height 1.2
		position relative
		padding 5px 30px 5px 15px
		width 100%
		text-align inherit

		@media $medium-up
			font-size 1.4rem

		&:focus
			border 1px solid rgba(#000, .1)
			border-bottom-color $black
			outline none
			background-color white

		&:after
			content ''
			position absolute
			right 10px
			top calc(50% - 2.5px)
			width 0
			height 0
			border-style solid
			border-width 5px 5px 0 5px
			border-color #000000 transparent transparent transparent

	&-list
		position absolute
		z-index 1
		top 100%
		left 0
		right 0
		background #fff
		box-shadow $box-shadow-small

	&-option
		padding 0 15px

		&:hover
			background darken(#fff, 10)
			cursor pointer

	&.is-placeholder
		.FormSelect-opener
			color $placeholder-color
</style>