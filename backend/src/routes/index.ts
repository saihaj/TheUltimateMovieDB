import { Router } from 'express'

import Users from './users'
import Movies from './movies'
import People from './people'

const routes = Router()

routes.get( '/', ( _, res ) => {
  res.json( {
    name: 'The Ultimate MovieDB',
  } )
} )

routes.use( '/users', Users )
routes.use( '/movies', Movies )
routes.use( '/people', People )

export default routes
