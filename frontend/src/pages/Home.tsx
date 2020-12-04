import React, { FC } from 'react'

import { PageProps } from '../lib/types'
import SearchBar from '../components/Search'
import LinkButton from '../components/LinkButton'
import Navbar from '../components/Navbar'

const HomePage:FC<PageProps> = () => (
  <>
    <Navbar />
    <main>
      <div className="flex h-screen items-center justify-center">

        <div className="-mt-64 flex flex-col items-center justify-center w-full md:w-3/4 lg:w-2/4">
          <img src="/logo-dark.png" alt="Logo" className="h-64 pb-8" />

          <SearchBar />

          <div className="pt-4">
            <LinkButton to="movies/genres" label="Genres" customStyles="md:mr-16 mr-2" />
            <LinkButton to={`movies?offset=${Math.round( Math.random() * 8500 )}`} label="Random Movie" />
          </div>
        </div>

      </div>
    </main>
  </>
)

export default HomePage
