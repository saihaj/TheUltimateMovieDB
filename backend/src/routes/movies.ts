import { Router } from 'express'

import dataset from '../movie-data'

const router = Router()

/**
 * Get all movies
 * Search params supported
 *   - title
 *   - genre
 *   - year
 *   - year
 *   - minrating
 */
router.get( '/', ( _, res ) => {
  res.json( dataset )
} )

/**
 * Get movie by ID
 * Return an object with following:
 *   - title
 *   - genre
 *   - year
 *   - year
 *   - actors
 *   - writer
 *   - director
 *   - ratings
 *   - reviews
 */
router.get( '/:movie', ( { params: { movie } }, res ) => {
  console.log( movie )
  res.json( movie )
} )

// Post a movie
router.post( '/', ( { params }, res ) => {
  const test = { ...params }
  console.log( test )
  res.json( test )
} )

export default router
