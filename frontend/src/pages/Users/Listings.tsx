/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useState, useEffect, useRef } from 'react'
import { navigate } from '@reach/router'
import useSwr from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'
import useQuery from '../../hooks/use-query'
import UserCard from '../../components/UserCard'

const Listings: FC<PageProps> = () => {
  const offset = useState( useQuery( 'offset' ) || 20 )
  const queryString = useRef( '/api/people?limit=48' )
  const [ mounted, setMounted ] = useState( false )

  useEffect( () => {
    const cleanQueryParam = () => `/api/people?limit=48&offset=${offset}`
    queryString.current = cleanQueryParam()
    setMounted( true )
  }, [ offset, mounted ] )

  const { data } = useSwr( mounted ? queryString.current : null )

  return (
    <Layout nav>

      {!data && <div>Loading...</div>}
      {data?.error && <h1 className="text-center text-3xl pt-16">We have a problem!</h1>}

      {!data?.error && data && (
        <>
          <h1 className="text-center text-3xl py-8 font-semibold">Listing of Directors/Writers/Actors</h1>
          <div className="md:flex md:flex-wrap">
            {/* @ts-expect-error */}
            {data.results.map( ( { _id: id, name } ) => (
              <UserCard key={id} to={id} name={name} />
            ) )}
          </div>

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

        </>
      )}

    </Layout>
  )
}

export default Listings
