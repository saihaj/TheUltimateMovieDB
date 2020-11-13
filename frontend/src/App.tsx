import React, { Suspense, lazy, useReducer } from 'react'
import { Router } from '@reach/router'

import { AuthContext, authReducer, initialAuthState } from './lib/auth'

const Home = lazy( () => import( './pages/Home' ) )
const Movies = lazy( () => import( './pages/Movies' ) )
const NotFound = lazy( () => import( './pages/404' ) )
const Register = lazy( () => import( './pages/Register' ) )
const Login = lazy( () => import( './pages/Login' ) )
const Profile = lazy( () => import( './pages/Users' ) )
const UserMePage = lazy( () => import( './pages/Me' ) )

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
    <Profile path="profile/*" />
    <UserMePage path="me" />
  </Router>
)

/**
 * Since we are lazy loading for router we use Suspense as fallback
 */
const App = () => {
  const [ state, dispatch ] = useReducer( authReducer, initialAuthState )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContext.Provider value={{ state, dispatch }}>
        <NavigationRoutes />
      </AuthContext.Provider>
    </Suspense>
  )
}

export default App
