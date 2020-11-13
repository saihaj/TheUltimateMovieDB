import React, { FC } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from '@reach/router'

import Layout from '../components/Layout'
import FormInputFields from '../components/FormInput'
import FormSubmitButton from '../components/FormSubmitButton'
import { PageProps } from '../lib/types'
import useQuery from '../hooks/use-query'
import { login } from '../lib/auth'

const registerFormOptions = [
  { id: 'email', type: 'email', placeholder: 'Email Address' },
  { id: 'password', type: 'password', placeholder: 'Password' },
]

const Register: FC<PageProps> = () => {
  const formik = useFormik( {
    initialValues: {
      email: useQuery( 'email' ) || '',
      password: '',
    },
    validationSchema: Yup.object().shape( {
      email: Yup.string()
        .email( 'Must be a valid email address' )
        .max( 100, 'Email must be less than 100 characters' )
        .required( 'Email is required' ),
      password: Yup.string()
        .min( 8, 'Password must be 8 characters long' )
        .max( 100, "Password can't be longer than 100 characters" )
        .matches( /^[a-zA-Z0-9]+$/, 'Password must be alpha numeric and contain Latin letters.' )
        .required( 'Password is required' ),
    } ),
    onSubmit: async values => {
      const response = await ( await login( values.email, values.password ) ).json()

      if ( !response.error ) {
        window.location.assign( '/me' )
      } else {
        alert( response.message )
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

          <h1 className="text-2xl font-bold text-center">Sign In</h1>

          {registerFormOptions.map( props => <FormInputFields formik={formik} {...props} /> )}

          <div className="flex justify-center">
            <FormSubmitButton label="Login" />
          </div>

          <div className="text-xl pt-2">
            <Link to="/register" className="hover:text-yellow-400">
              Don&apos;t have an account? Create one today!
            </Link>
          </div>

        </form>

      </div>

    </Layout>
  )
}

export default Register
