import { Router, json } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import responseTime from 'response-time'

const routes = Router()

routes.use( morgan( 'dev' ) ) // Deprecation warning is because of https://github.com/expressjs/morgan/issues/190
routes.use( helmet() )
routes.use( json() )
routes.use( cookieParser() )
routes.use( responseTime() )

// CORS middleware
routes.use( ( _req, res, next ) => {
  // update to match the domain you will make the request from
  res.header( 'Access-Control-Allow-Origin', 'http://localhost:3000' )
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' )
  next()
} )

export default routes
