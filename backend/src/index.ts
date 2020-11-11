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

  // Server
  app.listen( 4000, () => {
    console.log( 'Server ready at http://localhost:4000/' )
  } )
}

startServer()
