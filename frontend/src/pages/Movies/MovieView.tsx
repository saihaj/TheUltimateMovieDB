import React, { FC } from 'react'
import { useParams } from '@reach/router'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

const MovieView: FC<PageProps> = () => {
  const { movieId } = useParams()

  return (
    <Layout>
      <span role="img" aria-labelledby="under construction page for movie">
        🚧 You are watching future page for <b>{movieId}</b> 🚧
      </span>
    </Layout>
  )
}

export default MovieView
