import React, { Suspense, lazy } from 'react'
import { Router } from '@reach/router'

const Home = lazy( () => import( './pages/Home' ) )
const NotFound = lazy( () => import( './pages/404' ) )

/**
 * Setup Top-Level Routes for @reach/router
 */
const NavigationRoutes = () => (
  <Router>
    <NotFound default />
    <Home path="/" />
  </Router>
)

/**
 * Since we are lazy loading for router we use Suspense as fallback
 */
const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NavigationRoutes />
  </Suspense>
)

export default App
