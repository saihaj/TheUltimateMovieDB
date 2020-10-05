import React, { lazy, ComponentType } from 'react'
import { Router } from '@reach/router'

import { PageProps } from '../../lib/types'

const NotFound = lazy( () => import( '../404' ) )
const Listings = lazy( () => import( './Listings' ) )
const MovieView = lazy( () => import( './MovieView' ) )

const Movie: ComponentType<PageProps> = ( { children } ) => <div>{children}</div>

const Courses: ComponentType<PageProps> = () => (
  <Router>
    <NotFound default />
    <Listings path="/" />

    <Movie path=":movieId">
      <MovieView path="/" />
    </Movie>

  </Router>
)

export default Courses
