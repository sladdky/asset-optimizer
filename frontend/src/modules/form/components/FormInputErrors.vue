<template>
	<div v-if="errors.length" class="FormInputErrors">
		<span v-for="(error, index) in errors" :key="index"> {{ error }} </span>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { FormErrors } from '../types'

defineProps({
	errors: {
		type: Array as PropType<FormErrors[0]>,
		default: () => []
	}
})
</script>

<style lang="stylus" scoped>
.FormInputErrors
	display flex
	flex-flow column
	color red
	font-weight 700
</style>