import React, { FC } from 'react'
import { useParams } from '@reach/router'
import useSWR from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

type MovieComponentProps = {
  title: string
  posterUrl: string
  director: string
}

const MovieComponent = ( { title, posterUrl, director }: MovieComponentProps ) => (
  <div className="md:flex md:justify-around">
    <img
      alt={`Posted of ${title}`}
      src={posterUrl}
      className="lg:w-1/2 md:w-2/5 w-4/6 rounded-lg mx-auto md:mx-0"
    />
    <div className="flex flex-col my-auto text-center md:text-left">
      <h1 className="text-5xl font-bold">{title}</h1>
      <h3 className="text-2xl font-medium">{director}</h3>
    </div>
  </div>
)

const MovieView: FC<PageProps> = () => {
  const { movieId } = useParams()
  const { data, error } = useSWR( `/api/movies/${movieId}` )

  return (
    <Layout>
      {!error && !data && <div>Loading...</div>}
      {error && <h1 className="text-center text-3xl pt-16">We have a problem! Movie not found</h1>}
      {data && (
        <div className="max-w-2xl mx-auto pt-32">
          <MovieComponent
            title={data.title}
            posterUrl={data.poster}
            director={data.director}
          />
        </div>
      )}
    </Layout>
  )
}

export default MovieView
