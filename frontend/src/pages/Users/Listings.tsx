import React, { FC } from 'react'
import { Link } from '@reach/router'
import cx from 'clsx'
import useSwr from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

type UserCardProps = {
  name: string
  userId: string
}

const UserCard = ( { userId, name }: UserCardProps ) => (
  <div className="p-2 md:w-1/3">

    <Link to={userId}>

      <div
        className={cx(
          'h-full overflow-hidden mx-auto',
          'border-gray-100 border-2 rounded-lg hover:border-yellow-400',
          'lg:w-11/12 md:w-full w-2/3',
        )}
      >
        <div style={{ height: 'inherit' }} className="flex flex-col justify-between">

          <h1 className="text-3xl font-bold text-center">{name}</h1>
          <img src="https://via.placeholder.com/200" alt="Dummy profile Pic" />

        </div>
      </div>

    </Link>

  </div>
)

const Listings: FC<PageProps> = () => {
  const { data } = useSwr( '/api/people' )

  return (
    <Layout>
      {!data && <div>Loading...</div>}
      {data?.error && <h1 className="text-center text-3xl pt-16">We have a problem!</h1>}

      {!data?.error && data && (
        <>
          <h1 className="text-center text-3xl py-8 font-semibold">Listing of Directors/Writers/Actors</h1>
          <div className="md:flex md:flex-wrap">
            {/* @ts-expect-error */}
            {data.map( ( { _id: id, name } ) => (
              <UserCard key={id} userId={id} name={name} />
            ) )}
          </div>
        </>
      )}

    </Layout>
  )
}

export default Listings
