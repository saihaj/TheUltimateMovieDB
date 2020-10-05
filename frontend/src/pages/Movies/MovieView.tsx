import React, { FC } from 'react'
import { useParams } from '@reach/router'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

const MovieView: FC<PageProps> = () => {
  const { movieId } = useParams()

  return (
    <Layout>
      <div className="text-center text-xl md:text-2xl lg:text-3xl flex -mt-32 h-screen items-center justify-center">
        <span role="img" aria-labelledby="under construction page for movie">
          🚧 You are watching future page for <b>{movieId}</b> 🚧
        </span>
      </div>
    </Layout>
  )
}

export default MovieView
