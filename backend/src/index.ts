import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import users from './routes/users'

const app = express()

// Middlewares
app.use( morgan( 'dev' ) ) // Deprecation warning is because of https://github.com/expressjs/morgan/issues/190
app.use( helmet() )

// CORS middleware
app.use( ( _req, res, next ) => {
  // update to match the domain you will make the request from
  res.header( 'Access-Control-Allow-Origin', 'http://localhost:3000' )
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' )
  next()
} )

// Routes
app.get( '/', ( _req, res ) => {
  res.json( {
    name: 'The Ultimate MovieDB',
  } )
} )

app.use( '/users', users )

// Server
app.listen( 4000, () => {
  console.log( 'Server ready at http://localhost:4000/' )
} )
