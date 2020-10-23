import React, { FC } from 'react'
import { Link } from '@reach/router'
import cx from 'clsx'
import useSwr from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

type MovieCardProps = {
  /**
   * Movie's Title
   */
  title: string
  /**
   * Image URL for poster
   */
  posterUrl: string
  /**
   * Movie's director
   */
  director: string
  releaseDate: string
  rated: string
}

const MovieCard = ( { title, posterUrl, director, releaseDate, rated }: MovieCardProps ) => (
  <div className="p-2 md:w-1/3">

    <Link to={title}>

      <div
        className={cx(
          'h-full overflow-hidden mx-auto',
          'border-gray-100 border-2 rounded-lg hover:border-yellow-400',
          'lg:w-11/12 md:w-full w-2/3',
        )}
      >
        <div style={{ height: 'inherit' }} className="flex flex-col justify-between">

          <h1 className="text-3xl font-bold text-center">{title}</h1>
          <img src={posterUrl} alt={`Poster for ${title}`} />

          <div className="flex justify-between">

            <p className="text-lg ml-2 my-2">
              Director: <b>{director}</b>
              <br />
              Released on: {releaseDate}
            </p>

            <div className="my-auto mr-2">
              <h6
                className={cx(
                  'text-yellow-400 border-2 border-yellow-400 rounded-full',
                  'px-2 py-1',
                )}
              >
                {rated}
              </h6>
            </div>

          </div>

        </div>
      </div>

    </Link>

  </div>
)

const Listings: FC<PageProps> = () => {
  const { data, error } = useSwr( '/api/movies' )

  return (
    <Layout>
      {!error && !data && <div>Loading...</div>}
      {error && <h1 className="text-center text-3xl pt-16">We have a problem!</h1>}

      {data && (
      <div className="md:flex md:flex-wrap">
        {/* @ts-ignore */}
        {data.map( ( { title, poster, id, director, released, rated } ) => (
          <MovieCard
            key={id}
            title={title}
            posterUrl={poster}
            director={director}
            releaseDate={released}
            rated={rated}
          />
        ) )}
      </div>
      )}

    </Layout>
  )
}

export default Listings
