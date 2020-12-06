import { Router } from 'express'

import Users from './users'
import Movies from './movies'
import People from './people'
import Notifications from './notifications'

const routes = Router()

routes.get( '/', ( _, res ) => {
  res.json( {
    name: 'The Ultimate MovieDB',
  } )
} )

routes.use( '/users', Users )
routes.use( '/movies', Movies )
routes.use( '/people', People )
routes.use( '/notifications', Notifications )

export default routes
