import React, { lazy, ComponentType,useContext } from 'react'
import { Router } from '@reach/router'

import { PageProps } from '../../lib/types'
import { AuthContext } from '../../lib/auth'

const NotFound = lazy( () => import( '../404' ) )
const Listings = lazy( () => import( './Listings' ) )
const Genres = lazy( () => import( './GenreListing' ) )
const MovieView = lazy( () => import( './MovieView' ) )
const NotAllowed = lazy( () => import( '../../components/NotAllowed' ) )
const CreateMovie = lazy( () => import( './createMovie' ) )

const Movie: ComponentType<PageProps> = ( { children } ) => <div>{children}</div>

const Movies: ComponentType<PageProps> = () => {
  const { state: { role } } = useContext( AuthContext )

  return (
    <Router>
      <NotFound default />
      <Listings path="/" />
      <Genres path="/genres" />
      <Movie path=":movieId">
        <MovieView path="/" />
      </Movie>
      {role === 'contributing' ? <CreateMovie path="create" /> : <NotAllowed path="create" />}
    </Router>
  )
}
export default Movies
