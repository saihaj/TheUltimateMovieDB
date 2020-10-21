import { Router } from 'express'

const router = Router()

/**
 * Get all people
 * Search params supported:
 *  - name
 */
router.get( '/', ( _, res ) => {
  res.json( 'return a list of people' )
} )

// Get person by ID
router.get( '/:person', ( { params: { person } }, res ) => {
  console.log( person )
  res.json( person )
} )

export default router
