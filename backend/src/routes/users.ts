import { Router } from 'express'
import { v4 } from 'uuid'

const router = Router()

const users = [
  {
    id: '1',
    name: 'Rick Sanchez',
    role: 'Contributor',
  },
  {
    id: '2',
    name: 'Bob',
    role: 'Contributor',
  },
  {
    id: '3',
    name: 'Tom Cruise',
    role: 'Contributor',
  },
  {
    id: '4',
    name: 'Jimmy Fallen',
    role: 'Contributor',
  },
]

/**
 * Get all users
 * Search params supported:
 *  - name
 */
router.get( '/', ( _, res ) => {
  res.json( users )
} )

// Get user by ID
router.get( '/:user', ( { params: { user } }, res ) => {
  const currentUser = users.find( ( { id } ) => id === user )

  if ( currentUser === undefined ) {
    res.status( 404 )
  }

  res.json( currentUser )
} )

// Add a user
router.post( '/', ( { body }, res ) => {
  users.push( { id: v4(), ...body } )
  res.status( 200 ).json( { message: 'Successfully added the user' } )
} )

export default router
