import { reactive } from 'vue'
import { ValidateOptions, ValidationError, ObjectSchema } from 'yup'
import { FormErrors } from '../types/FormErrors'

type Props<TFormFields extends object, TSchema> = {
	fields: TFormFields
	schema: TSchema & ObjectSchema<any>
	onValidSubmit?: (fields: TFormFields) => void
}

export function useForm<TFormFields extends object, TSchema>({ fields: _fields, schema: _schema, onValidSubmit = () => {} }: Props<TFormFields, TSchema>) {
	const _errors: FormErrors = {}

	const fields = reactive(_fields)
	const errors = reactive(_errors)

	const validate = async (options?: ValidateOptions) => {
		options = {
			abortEarly: false,
			...options,
		}

		let isValid = true
		try {
			await _schema.validate(fields, options)
		} catch (err) {
			const yupError = err as ValidationError

			for (const key in errors) {
				delete errors[key]
			}

			yupError.inner.forEach((error) => {
				const { path } = error
				if (!path) {
					//nopath error
					return
				}
				if (!errors[path]) {
					errors[path] = []
				}
				errors[path].push(...error.errors)
			})
			console.log(errors)
			isValid = false
		} finally {
			//
		}

		return isValid
	}

	const submit = async () => {
		const isValid = await validate()
		if (isValid) {
			const values: TFormFields = _schema.cast(fields)
			onValidSubmit(values)
		}
	}

	return {
		fields,
		errors,
		validate,
		onValidSubmit,
		submit,
	}
}
