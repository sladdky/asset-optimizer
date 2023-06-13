<template>
	<textarea class="FormInput FormInput--textarea" v-model="model" v-if="type === 'textarea'"></textarea>
	<input class="FormInput" :type="type" v-model="model" v-else />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
	value: string
	type: FormInputTypes
}>()

const emit = defineEmits<{
	(event: 'frmchange', value: string): void
}>()

type FormInputTypes = 'textarea' | 'text' | 'number' | 'password'

const model = computed({
	get() {
		return props.value
	},
	set(value: string) {
		emit('frmchange', value)
	}
})
</script>

<style lang="stylus">
.FormInput
	border 1px solid #999
	background #999
	box-shadow none
	padding 0
	border-radius 0
	width 100%
	margin 0
	line-height 1.2
	position relative
	padding 5px 15px

	@media $medium-up
		font-size 1.4rem

	&:focus
		border 1px solid rgba(#000, .1)
		outline none
		background-color white

	&::placeholder
		opacity .5
		color #333
		font-family inherit

		&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus
			//border 1px solid darken($color-darkBlue, 5)
			-webkit-text-fill-color $black
			-webkit-box-shadow 0 0 0px 1000px #fff inset
			transition background-color 5000s ease-in-out 0s

	&--textarea
		border-bottom 1px solid #000
		width 100%
		padding-top 20px
		padding-bottom 20px
		min-height 104px
		resize vertical
		display block
</style>