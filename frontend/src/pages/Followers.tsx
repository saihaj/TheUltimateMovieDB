/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { useParams } from '@reach/router'
import useSWR from 'swr'
// @ts-expect-error missing type defs
import title from 'title'

import { PageProps } from '../lib/types'
import Layout from '../components/Layout'
import UserCard from '../components/UserCard'

const Followers: FC<PageProps> = () => {
  const { userId } = useParams()
  const { data } = useSWR( `/api/users/followers/${userId}` )

  return (
    <Layout nav>
      {!data && <div>Loading...</div>}

      {data?.error && <h1 className="text-center text-3xl pt-16">We have a problem!</h1>}

      {!data?.error && data && (
      <>
        <h1 className="text-center text-3xl py-8 font-semibold">{title( data.name )}&apos;s Followers</h1>
        <div className="md:flex md:flex-wrap">
          {data.followers.map( ( a: { _id: string ; name: string } ) => (
            <UserCard key={a._id} to={`/profile/${a._id}`} name={a.name} />
          ) )}
        </div>
      </>
      )}
    </Layout>
  )
}

export default Followers
