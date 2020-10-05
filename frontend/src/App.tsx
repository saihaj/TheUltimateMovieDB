import React, { Suspense, lazy } from 'react'
import { Router } from '@reach/router'

const Home = lazy( () => import( './pages/Home' ) )
const Movies = lazy( () => import( './pages/Movies' ) )
const NotFound = lazy( () => import( './pages/404' ) )

/**
 * Setup Top-Level Routes for @reach/router
 */
const NavigationRoutes = () => (
  <Router>
    <NotFound default />
    <Home path="/" />
    <Movies path="movies/*" />
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
