import React, { FC } from 'react'
import { useParams } from '@reach/router'
import useSWR from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

type ProfileDataProps = {
  name: string;
}

const ProfileData = ( { name }: ProfileDataProps ) => (
  <div className="flex justify-around mt-8">
    <img className="rounded-full h-56" src="https://via.placeholder.com/300" alt="Dummy Profile Pic" />

    <div className="my-auto">
      <h1 className="text-4xl font-medium">{name}</h1>
    </div>
  </div>
)

const Profile: FC<PageProps> = () => {
  const { personId } = useParams()
  const { data } = useSWR( `/api/people/${personId}` )

  return (
    <Layout nav>
      {!data && <div>Loading...</div>}
      {data?.error && <h1 className="text-center text-3xl pt-16">We have a problem! User not found</h1>}
      {!data?.error && data && (
      <>
        <h2 className="text-center py-16 text-2xl">Other Information coming soon!</h2>
        <ProfileData name={data.name} />
      </>
      )}
    </Layout>
  )
}
export default Profile
