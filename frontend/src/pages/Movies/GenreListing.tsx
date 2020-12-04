import React, { FC } from 'react'
import { Link } from '@reach/router'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'
import { GENRES } from '../../lib/consts'

const GenreListing: FC<PageProps> = () => (
  <Layout>
    <h1 className="text-4xl text-center font-bold">Genres</h1>
    <div className="md:flex md:flex-wrap text-center">
      {GENRES.map( a => (
        <div key={a} className="p-2 md:w-1/3">
          <Link to={`/movies?genre=${a}&limit=50`} className="text-3xl hover:text-yellow-400">{a}</Link>
        </div>
      ) )}
    </div>
  </Layout>
)

export default GenreListing
