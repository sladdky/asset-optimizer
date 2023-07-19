<template>
    <form class="PresetForm" @submit.prevent="handleSubmit">
        <FormItem>
            <FormInput type="text" :value="fields['pattern']" @frmchange="(value) => handleInputChange('pattern', value)" placeholder="*. | my-folder/*.\.jpg | ..." />
            <FormInputErrors :errors="errors['pattern']" />
        </FormItem>
        <button class="PresetForm-button" type="submit">+create preset</button>
    </form>
</template>

<script lang="ts" setup>
import { FormItem, FormInput, FormInputErrors, useForm, FormSelect } from '@/form'
import { object, string } from 'yup'
import { AssetOptimizerPreset } from '@/types'
import { useSocket } from '@/shared-hooks'

type FormFields = {
    pattern: string
}

const schema = object<AssetOptimizerPreset>({
    pattern: string()
        .required('Regex pattern is required')
})


const { fields, errors, validate } = useForm<FormFields, typeof schema>(
    {
        fields: {
            pattern: ''
        },
        schema
    }
)

const handleInputChange = <TKey extends keyof FormFields>(prop: TKey, value: FormFields[TKey]) => {
    errors[prop] = []
    fields[prop] = value
}

const handleSubmit = async () => {
    const isValid = await validate()
    if (!isValid) {
        return
    }

    socket.emit('preset:create', fields)
    fields.pattern = ''
}

const { socket } = useSocket()
</script>

<style lang="stylus" scoped>
.PresetForm
    display grid
    align-items flex-start
    grid-template-columns 425px 170px
    gap 10px
    font-size 14px
    padding 20px 20px 0

    &-button
        padding 5px 10px
        display flex
        align-items center
        justify-content center
        background var(--color-primary)
        color var(--color-primary-invert)
        cursor pointer
        border-radius var(--border-radius)
</style>