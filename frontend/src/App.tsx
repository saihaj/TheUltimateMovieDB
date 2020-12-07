import React, { Suspense, lazy, useReducer, useEffect } from 'react'
import { Router } from '@reach/router'
import { ToastProvider } from 'react-toast-notifications'

import { AuthContext, authReducer, initialAuthState, AUTH_ACTIONS, parseCookies } from './lib/auth'

const Home = lazy( () => import( './pages/Home' ) )
const Movies = lazy( () => import( './pages/Movies' ) )
const NotFound = lazy( () => import( './pages/404' ) )
const Register = lazy( () => import( './pages/Register' ) )
const Login = lazy( () => import( './pages/Login' ) )
const Profile = lazy( () => import( './pages/Profile' ) )
const UserMePage = lazy( () => import( './pages/Me' ) )
const People = lazy( () => import( './pages/Users' ) )
const Followers = lazy( () => import( './pages/Followers' ) )
const Following = lazy( () => import( './pages/Following' ) )
const NotificationWrapper = lazy( () => import( './components/NotificationWrapper' ) )

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
    <Followers path="profile/:userId/followers" />
    <Following path="profile/:userId/following" />
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
    // @ts-expect-error too much work to get these type to work
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
        <ToastProvider
          autoDismiss
          autoDismissTimeout={3000}
          placement="top-right"
        >
          <NotificationWrapper>
            <NavigationRoutes />
          </NotificationWrapper>
        </ToastProvider>
      </AuthContext.Provider>
    </Suspense>
  )
}

export default App
