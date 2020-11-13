import React, { InputHTMLAttributes } from 'react'
import { FormikValues } from 'formik'
import clsx from 'clsx'

type FormItemsProps = {
    id: NonNullable<InputHTMLAttributes<HTMLInputElement>['id']>,
    placeholder: NonNullable<InputHTMLAttributes<HTMLInputElement>['placeholder']>,
    type: NonNullable<InputHTMLAttributes<HTMLInputElement>['type']>,
    formik: FormikValues
}

const FormItems = ( { id, placeholder, type, formik }:FormItemsProps ) => (
  <label htmlFor={id} key={id}>

    <span>{placeholder}</span>

    <div className="flex">

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...formik.getFieldProps( id )}
        className={clsx(
          'form-input my-2 block w-full rounded-lg text-black',
          { 'border-yellow-400 border-4': formik.errors[ id ] },
        )}
      />

      {formik.touched[ id ] && formik.errors[ id ] ? (
        <div className="w-6 text-red-600 my-auto" style={{ marginLeft: '-35px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ) : null}

    </div>

    {formik.touched[ id ] && formik.errors[ id ] ? (
      <div>
        <p className="text-red-600 text-xs italic">{formik.errors[ id ]}</p>
      </div>
    ) : null}

  </label>
)

export default FormItems
