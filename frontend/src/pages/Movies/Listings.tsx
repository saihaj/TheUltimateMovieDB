/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
import React, { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from '@reach/router'
import useSwr from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'
import useQuery from '../../hooks/use-query'
import MovieCard, { MovieCardProps } from '../../components/MovieCard'

const Listings: FC<PageProps> = () => {
  const [ mounted, setMounted ] = useState( false )
  const offset = useState( useQuery( 'offset' ) || 0 )
  const title = useQuery( 'title' ) || undefined
  const genre = useQuery( 'genre' ) || undefined
  const limit = useQuery( 'limit' ) || 9
  const apiQueryString = `/api/movies?limit=${limit}`
  const queryString = useRef( apiQueryString )
  const navigate = useNavigate()

  useEffect( () => {
    const cleanQueryParam = () => {
      if ( title && genre ) {
        return `${apiQueryString}&title=${title}&genre=${genre}`
      }

      if ( title ) {
        return `${apiQueryString}&title=${title}`
      }

      if ( genre ) {
        return `${apiQueryString}&genre=${genre}`
      }

      return `${apiQueryString}&offset=${offset}`
    }
    queryString.current = cleanQueryParam()
    setMounted( true )
  }, [ title, genre, offset, mounted ] )

  const { data, error } = useSwr( mounted ? queryString.current : null )

  return (
    <Layout nav>
      {!error && !data && <div>Loading...</div>}
      {error && (
      <h1 className="text-center text-3xl pt-16">We have a problem!</h1>
      )}

      {data && (
      <div className="md:flex md:flex-wrap">
        {data.results.map(
          ( a: {
              _id: MovieCardProps['movieId'];
              title: MovieCardProps['title'];
              poster: MovieCardProps['posterUrl'];
              directors: MovieCardProps['director'];
              meta: { releaseDate: MovieCardProps['releaseDate'] };
            } ) => (
              <MovieCard
                key={a._id}
                movieId={a._id}
                title={a.title}
                posterUrl={a.poster}
                director={a.directors}
                releaseDate={a.meta.releaseDate}
              />
          ),
        )}
        {!genre && !title && (
        <div
          className="text-center text-4xl mx-auto py-2 hover:text-yellow-400"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const url = new URL( window.location.href )
            url.searchParams.set( 'offset', data.info.nextOffset )
            navigate( `${url.pathname}${url.search}`, { replace: true } )
            // eslint-disable-next-line no-restricted-globals
            location.reload()
          }}
        >
          Next
        </div>
        )}
      </div>
      )}
    </Layout>
  )
}

export default Listings
