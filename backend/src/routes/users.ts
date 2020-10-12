import { Router } from 'express'

const router = Router()

router.get( '/', ( _, res ) => {
  res.status( 200 ).json( {
    message: 'Handling GET requests to /users',
  } )
} )

router.get( '/:UserID', ( req, res ) => {
  const id = req.params.UserID;
  if ( id === 'special' ) {
    res.status( 200 ).json( {
      message: 'You have discovered the special ID',
      id,
    } );
  } else {
    res.status( 200 ).json( {
      message: 'you passed an ID',
    } );
  }
} )

export default router
