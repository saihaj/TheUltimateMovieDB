/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { useParams } from '@reach/router'
import useSWR from 'swr'
// @ts-expect-error missing type defs
import title from 'title'

import { PageProps } from '../lib/types'
import Layout from '../components/Layout'
import UserCard from '../components/UserCard'

const Following: FC<PageProps> = () => {
  const { userId } = useParams()
  const { data } = useSWR( `/api/users/following/${userId}` )

  return (
    <Layout nav>
      {!data && <div>Loading...</div>}

      {data?.error && <h1 className="text-center text-3xl pt-16">We have a problem!</h1>}

      {!data?.error && data && (
        <>
          <h1 className="text-center text-3xl py-8 font-semibold">Followed By {title( data.name )}</h1>
          <div className="md:flex md:flex-wrap">
            {data.followingPeople.map( ( a: { _id: string ; name: string } ) => (
              <UserCard key={a._id} to={`/people/${a._id}`} name={a.name} />
            ) )}
            {data.followingUser.map( ( a: { _id: string ; name: string } ) => (
              <UserCard key={a._id} to={`/profile/${a._id}`} name={a.name} />
            ) )}
          </div>
        </>
      )}
    </Layout>
  )
}

export default Following
