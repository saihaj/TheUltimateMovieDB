import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type FormSubmitButtonProps = {
    label:string,
    customClass?:string,
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const FormSubmitButton = ( { label, customClass, ...props } :FormSubmitButtonProps ) => (
  <button
    type="submit"
    className={clsx(
      'mt-2 w-full py-1 font-semibold',
      'rounded-lg border-2 border-white',
      'hover:bg-yellow-400 hover:border-yellow-400 hover:text-indigo-800',
      customClass,
    )}
    {...props}
  >
    {label}
  </button>
)

export default FormSubmitButton
