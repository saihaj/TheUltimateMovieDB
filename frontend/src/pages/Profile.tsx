import React, { FC } from 'react'
import { Link } from '@reach/router'

import { PageProps } from '../lib/types'
import Layout from '../components/Layout'

const UserProfile: FC<PageProps> = () => (
  <Layout>
    <div className="flex justify-around mt-8">
      <img className="rounded-full h-56" src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" alt="Rick's profile pic" />

      <div className=" my-auto">
        <h1 className="text-4xl font-medium">Rick Sanchez</h1>
        <h3 className="text-lg">Role: Contributor</h3>
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-around">

      <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
        <h3 className="text-xl text-center font-medium">Top 5 recent Likes</h3>
        <div className="text-lg border-gray-400 border-2 rounded-lg flex flex-col">
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Toy Story">Toy Story</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/GoldenEye">GoldenEye</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Sabrina">Sabrina</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Anatomy Park">Anatomy Park</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Pilot">Pilot</Link>
        </div>
      </div>

      <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
        <h3 className="text-xl text-center font-medium">Top 5 recent Contributions</h3>
        <div className="text-lg border-gray-400 border-2 rounded-lg flex flex-col">
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Anchor Gear">Anchor Gear</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Mortynight Run">Mortynight Run</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Close Rick-counters of the Rick Kind">Close Rick-counters of the Rick Kind</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Heat">Heat</Link>
          <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Jumanji">Jumanji</Link>
        </div>
      </div>

    </div>

  </Layout>
)

export default UserProfile
