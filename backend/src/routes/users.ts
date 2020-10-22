import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid';

const users = [
  {
    id: '01',
    name: 'Test',
    role: 'Tester',
  },
  {
    id: '02',
    name: 'Test',
    role: 'Tester',
  },
]
const router = Router()

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
  for ( let i = 0; i < users.length; i += 1 ) {
    if ( users.id == user ) {
      console.log( user )
    }
  }
  res.json( user )
} )

// Add a user
router.post( '/', ( { params }, res ) => {
  const test = { ...params }
  test.id = uuidv4()
  test.name = params.name
  console.log( test )
  res.json( test )
} )
