'use client'

// ----------------------------------------------------------------------

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  id?: string
  type: string
  name?: string
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  required?: boolean
  maxLength?: number
  value?: string
  readOnly?: boolean
  disabled?: boolean
  endAdornment?: React.ReactNode
}

const InputField = ({
  label,
  id,
  type,
  name,
  placeholder,
  onChange,
  onFocus,
  required,
  maxLength,
  value,
  readOnly,
  disabled,
  endAdornment
}: InputFieldProps) => {
  return (
    <>
      <div className={label ? 'mb-2' : ''}>
        {label ? (
          <label
            htmlFor={`${id}-input`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          <input
            className={`bg-white text-sm w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors ${
              endAdornment ? 'pr-16' : ''
            }`}
            id={`${id}-input`}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            required={required}
            maxLength={maxLength}
            value={value}
            readOnly={readOnly}
            disabled={disabled}
          />
          {endAdornment ? (
            <div className="absolute inset-y-0 right-2 flex items-center">
              {endAdornment}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default InputField
