import { Router } from 'express'

const router = Router()

/**
 * Get all users
 * Search params supported:
 *  - name
 */
router.get( '/', ( _, res ) => {
  const users = [
    {
      name: 'Test',
      role: 'Tester',
    },
    {
      name: 'Test',
      role: 'Tester',
    },
  ]
  res.json( users )
} )

// Get user by ID
router.get( '/:user', ( { params: { user } }, res ) => {
  console.log( user )
  res.json( user )
} )

// Add a user
router.post( '/', ( { params }, res ) => {
  const test = { ...params }
  console.log( test )
  res.json( test )
} )

export default router
