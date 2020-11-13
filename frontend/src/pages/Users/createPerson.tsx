import React, { FC } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'

import Layout from '../../components/Layout'
import FormItems from '../../components/FormInput'
import FormSubmitButton from '../../components/FormSubmitButton'
import { PageProps } from '../../lib/types'

const FormOptions = [
  { id: 'name', type: 'text', placeholder: 'Name' },
]

const Register: FC<PageProps> = () => {
  const formik = useFormik( {
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object().shape( {
      name: Yup.string()
        .min( 3, 'Name must have at least 3 characters' )
        .max( 100, "Name can't be longer than 100 characters" )
        .required( 'Name is required' ),
    } ),
    onSubmit: async values => {
      const response = await fetch( '/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { name: values.name } ),
      } )

      // If all good sign in the user and take to profile page
      if ( response.status === 200 ) {
        window.location.assign( '/people' )
      } else {
        const { message } = await response.json()
        alert( `Something went wrong!!! ${message}` )
      }
    },
  } )

  return (
    <Layout>

      <div className="md:flex md:items-center md:-mt-16 md:h-screen pt-6">

        <form
          style={{ boxShadow: '2px 2px 15px 5px rgba(0,0,0,0.4)' }}
          className={clsx(
            'font-medium text-xl',
            'sm:w-3/4 mt-5 p-3 mx-auto',
            'border-2 box-border',
            'rounded-lg',
          )}
          onSubmit={formik.handleSubmit}
        >

          <h1 className="text-2xl font-bold text-center">Create new person profile (director/writer/actor)</h1>

          {FormOptions.map( props => <FormItems formik={formik} {...props} /> )}

          <div className="flex justify-center">
            <FormSubmitButton label="Add new Person" />
          </div>

        </form>

      </div>

    </Layout>
  )
}

export default Register
