/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'

import Layout from '../../components/Layout'
import FormItems from '../../components/FormInput'
import FormSubmitButton from '../../components/FormSubmitButton'
import { PageProps } from '../../lib/types'
import { List } from '../../lib/utils'

const FormOptions = [
  { id: 'title', type: 'text', placeholder: 'Title' },
  { id: 'genre', type: 'text', placeholder: 'Genre' },
  { id: 'plot', type: 'text', placeholder: 'Plot' },
  { id: 'releaseDate', type: 'text', placeholder: 'Release Date' },
  { id: 'directors', type: 'text', placeholder: 'Directors' },
  { id: 'actors', type: 'text', placeholder: 'Actors' },
  { id: 'writers', type: 'text', placeholder: 'Writers' },
]

const CreateMovie: FC<PageProps> = () => {
  const formik = useFormik( {
    initialValues: {
      title: '',
      genre: '',
      plot: '',
      releaseDate: '',
      directors: '',
      writers: '',
      actors: '',
    },
    validationSchema: Yup.object().shape( {
      title: Yup.string()
        .min( 1, 'Must have at least 1 characters' )
        .max( 100, 'First name must be less than 100 characters' )
        .required( 'Title is required' ),
      genre: Yup.string()
        .min( 3, 'Must have at least 3 characters' )
        .required( 'Genre is required' ),
      releaseDate: Yup.string()
        .required( 'Release Date is required' ),
      directors: Yup.string()
        .min( 3, 'Must have at least 3 characters' )
        .required( 'Director is required' ),
      writers: Yup.string()
        .min( 3, 'Must have at least 3 characters' )
        .required( 'Writers is required' ),
      actors: Yup.string()
        .min( 3, 'Must have at least 3 characters' )
        .required( 'Actors is required' ),
    } ),
    onSubmit: async values => {
      const response = await fetch( '/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          title: values.title,
          genre: List( values.genre ),
          plot: values.plot,
          releaseDate: values.releaseDate,
          directors: List( values.directors ),
          writers: List( values.writers ),
          actors: List( values.actors ),
        } ),
      } )

      if ( response.status === 200 ) {
        const res = await response.json()
        window.location.assign( `/movies/${res._id}` )
      } else {
        const { message } = await response.json()
        alert( `${message}` )
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

          <h1 className="text-2xl font-bold text-center">Create new Movie</h1>

          {FormOptions.map( props => <FormItems formik={formik} {...props} /> )}

          <div className="flex justify-center">
            <FormSubmitButton label="Add New Movie" />
          </div>

        </form>

      </div>

    </Layout>
  )
}

export default CreateMovie
