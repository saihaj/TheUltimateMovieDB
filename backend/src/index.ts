import express from 'express'
import mongoose from 'mongoose'

import apiRoutes from './routes'
import middleware from './utils/middleware'

const app = express()

const startServer = async () => {
  // Connect to DB
  try {
    await mongoose.connect( 'mongodb://root:toor@localhost:27017', { useNewUrlParser: true } )
    console.log( 'Connected to MongoDB' )
  } catch ( err ) {
    console.log( err )
    console.error( 'Unable to connect to MongoDB' )
    process.exit( 126 )
  }

  app.use( middleware )
  app.use( apiRoutes )

  // 404 errors
  app.use( ( _res, _req, next ) => {
    const error = new Error( 'Not found' );
    // @ts-expect-error
    error.status = 404;
    next( error );
  } );

  // Error handler (all errors are passed to this)
  // @ts-expect-error
  app.use( ( { message, status }, { method, path }, res, next ) => {
    const errorCode = status || 500
    res.status( errorCode ).json( {
      error: errorCode,
      request: { method, path },
      message,
    } );
    next();
  } );

  // Server
  app.listen( 4000, () => {
    console.log( 'Server ready at http://localhost:4000/' )
  } )
}

startServer()
