<template>
    <div class="FormReplicator">
        <div class="FormReplicator-item" v-for="(item, index) in value" :key="index">
            <slot name="item" :item="item"> Missing template for item </slot>
            <slot name="remove">
                <button type="button" @click="handleRemoveClick">remove item</button>
            </slot>
        </div>
        <slot name="add">
            <button type="button" @click="handleAddClick">add item</button>
        </slot>
    </div>
</template>

<script lang="ts" setup generic="T extends object">
import { computed } from 'vue'
import { FormErrors } from '../types'


const props = defineProps<{
    value: T[],
    errors: FormErrors
}>()

const emit = defineEmits<{
    (event: 'frmchange', value: T[]): void
}>()

const model = computed({
    get() {
        return props.value
    },
    set(value: T[]) {
        emit('frmchange', value)
    }
})

const handleAddClick = () => {
    emit('frmchange', value)
}

const handleRemoveClick = () => {

}

</script>

<style lang="stylus" scoped>
.FormArray
    display block
</style>