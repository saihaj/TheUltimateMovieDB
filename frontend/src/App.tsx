import React, { Suspense, lazy, useReducer, useEffect } from 'react'
import { Router } from '@reach/router'

import { AuthContext, authReducer, initialAuthState, AUTH_ACTIONS, parseCookies } from './lib/auth'

const Home = lazy( () => import( './pages/Home' ) )
const Movies = lazy( () => import( './pages/Movies' ) )
const NotFound = lazy( () => import( './pages/404' ) )
const Register = lazy( () => import( './pages/Register' ) )
const Login = lazy( () => import( './pages/Login' ) )
const Profile = lazy( () => import( './pages/Profile' ) )
const UserMePage = lazy( () => import( './pages/Me' ) )
const People = lazy( () => import( './pages/Users' ) )

/**
 * Setup Top-Level Routes for @reach/router
 */
const NavigationRoutes = () => (
  <Router>
    <NotFound default />
    <Home path="/" />
    <Movies path="movies/*" />
    <Register path="register" />
    <Login path="login" />
    <Profile path="profile/:userId" />
    <People path="people/*" />
    <UserMePage path="me" />
  </Router>
)

/**
 * Since we are lazy loading for router we use Suspense as fallback
 */
const App = () => {
  const [ state, dispatch ] = useReducer( authReducer, initialAuthState )

  useEffect( () => {
    const cookies = parseCookies()
    // @ts-expect-error
    const refreshToken = cookies[ 'refresh-token' ]

    fetch( '/api/users/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        token: refreshToken,
      } ),
    } )
      .then( () => dispatch( { type: AUTH_ACTIONS.reLogin } ) )
      .catch( err => alert( err ) )
  }, [ dispatch ] )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContext.Provider value={{ state, dispatch }}>
        <NavigationRoutes />
      </AuthContext.Provider>
    </Suspense>
  )
}

export default App
