import React, { FC } from 'react'
import { Link } from '@reach/router'

import temp from '../../movie-data-short.json'
import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

const Listings: FC<PageProps> = () => (
  <Layout>

    {temp.map( ( { Title, Poster, imdbID } ) => (
      <div key={imdbID} className="mb-16 border-gray-100 border-2">

        <Link to={Title}>
          <h1 className="text-4xl font-bold">{Title}</h1>
          <img src={Poster} alt={`Poster for ${Title}`} />
        </Link>

      </div>
    ) )}

  </Layout>
)

export default Listings
