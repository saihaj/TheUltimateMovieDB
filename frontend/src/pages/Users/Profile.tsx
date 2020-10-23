import React, { FC } from 'react'
import { Link, useParams } from '@reach/router'
import useSWR from 'swr'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

const DummyContribData = () => (
  <>
    <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
      <h3 className="text-xl text-center font-medium">Top 5 recent Likes</h3>
      <div className="text-lg border-gray-400 border-2 rounded-lg flex flex-col">
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/1">Toy Story</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/10">GoldenEye</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/7">Sabrina</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/asdf">Anatomy Park</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/515">Pilot</Link>
      </div>
    </div>

    <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
      <h3 className="text-xl text-center font-medium">Top 5 recent Contributions</h3>
      <div className="text-lg border-gray-400 border-2 rounded-lg flex flex-col">
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Anchor Gear">Anchor Gear</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Mortynight Run">Mortynight Run</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Close Rick-counters of the Rick Kind">Close Rick-counters of the Rick Kind</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Heat">Heat</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/2">Jumanji</Link>
      </div>
    </div>
  </>

)

type UserProfileDataProps = {
  name: string;
  userRole: string;
}

const UserDataFetch = ( { name, userRole }: UserProfileDataProps ) => (
  <div className="flex justify-around mt-8">
    <img className="rounded-full h-56" src="https://via.placeholder.com/300" alt="Dummy Profile Pic" />

    <div className=" my-auto">
      <h1 className="text-4xl font-medium">{name}</h1>
      <h3 className="text-lg">Role: {userRole}</h3>
    </div>
  </div>
)

const UserProfile: FC<PageProps> = () => {
  const { userId } = useParams()
  const { data, error } = useSWR( `/api/users/${userId}` )

  return (
    <Layout>
      {!error && !data && <div>Loading...</div>}
      {error && <h1 className="text-center text-3xl pt-16">We have a problem! User not found</h1>}
      {data && (
      <>
        <UserDataFetch name={data.name} userRole={data.role} />
        <div className="flex flex-col md:flex-row justify-around">
          <DummyContribData />
        </div>
      </>
      )}
    </Layout>
  )
}
export default UserProfile
