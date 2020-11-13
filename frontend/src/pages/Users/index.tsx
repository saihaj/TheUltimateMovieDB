import React, { lazy, ComponentType, useContext } from 'react'
import { Router } from '@reach/router'

import { PageProps } from '../../lib/types'
import { AuthContext } from '../../lib/auth'

const NotFound = lazy( () => import( '../404' ) )
const Listings = lazy( () => import( './Listings' ) )
const Profile = lazy( () => import( './Profile' ) )
const CreateUser = lazy( () => import( './createPerson' ) )
const NotAllowed = lazy( () => import( '../../components/NotAllowed' ) )

const People: ComponentType<PageProps> = () => {
  const { state: { role } } = useContext( AuthContext )

  return (
    <Router>
      <NotFound default />
      <Listings path="/" />
      <Profile path="/:personId" />
      {role === 'contributing' ? <CreateUser path="create" /> : <NotAllowed path="create" />}
    </Router>
  )
}

export default People
