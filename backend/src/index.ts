import express from 'express'

import apiRoutes from './routes'
import middleware from './utils/middleware'

const app = express()

app.use( middleware )
app.use( apiRoutes )

// Server
app.listen( 4000, () => {
  console.log( 'Server ready at http://localhost:4000/' )
} )
