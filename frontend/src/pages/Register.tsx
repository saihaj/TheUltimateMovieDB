import React, { FC } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from '@reach/router'

import Layout from '../components/Layout'
import { PageProps } from '../lib/types'

const registerFormOptions = [
  { id: 'firstName', type: 'text', placeholder: 'First Name' },
  { id: 'lastName', type: 'text', placeholder: 'Last Name' },
  { id: 'email', type: 'email', placeholder: 'Email Address' },
  { id: 'password', type: 'password', placeholder: 'Password' },
]

const Register: FC<PageProps> = () => {
  const formik = useFormik( {
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape( {
      firstName: Yup.string()
        .min( 3, 'First name must have at least 3 characters' )
        .max( 100, "First name can't be longer than 100 characters" )
        .required( 'First name is required' ),
      lastName: Yup.string()
        .min( 2, 'Names must have at least 2 characters' )
        .max( 100, "Last name can't be longer than 100 characters" ),
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
    onSubmit: values => {
      alert( JSON.stringify( values, null, 2 ) )
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

          <h1 className="text-2xl font-bold text-center">Create an account</h1>

          {registerFormOptions.map( ( { id, type, placeholder } ) => (
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
                    //  @ts-expect-error return type issue because of `id`. I trust myself.
                    { 'border-yellow-400 border-4': formik.errors[ id ] },
                  )}
                />

                {/* @ts-expect-error return type issue because of `id`. I trust myself. */}
                {formik.touched[ id ] && formik.errors[ id ] ? (
                  <div className="w-6 text-indigo-800 my-auto" style={{ marginLeft: '-35px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : null}

              </div>

            </label>
          ) )}

          <div className="flex justify-center">
            <button
              type="submit"
              className={clsx(
                'mt-2 w-full py-1 font-semibold',
                'rounded-lg border-2 border-white',
                'hover:bg-yellow-400 hover:border-yellow-400 hover:text-indigo-800',
              )}
            >
              Register
            </button>
          </div>

          <div className="text-xl pt-2">
            <Link to="/login" className="hover:text-yellow-400">
              Already have an account? Login
            </Link>
          </div>

        </form>

      </div>

    </Layout>
  )
}

export default Register
