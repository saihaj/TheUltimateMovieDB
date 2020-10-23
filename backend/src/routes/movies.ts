import { Router } from 'express'
import { v4 } from 'uuid'
import { pick } from 'lodash'

import dataset from '../movie-data'

const router = Router()

const returnItems = [ 'id', 'title', 'genre', 'director', 'actors', 'writer', 'poster', 'rated', 'released' ]

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
  const temp:any = []

  dataset.forEach( ( a ) => temp.push( pick( a, returnItems ) ) )

  res.json( temp )
} )

/**
 * Get movie by ID
 * Return an object with following:
 *   - title
 *   - genre
 *   - year
 *   - actors
 *   - writer
 *   - director
 *   - poster
 *   - rated
 *   - released
 */
router.get( '/:movie', ( { params: { movie } }, res ) => {
  const currentMov = dataset.find( ( { id } ) => id === movie )

  if ( currentMov === undefined ) {
    res.status( 404 )
  }

  res.json( pick( currentMov, returnItems ) )
} )

// Post a movie
router.post( '/', ( { body }, res ) => {
  const input = { id: v4(), ...body }
  dataset.push( input )
  res.status( 200 ).json( { message: 'Successfully added the movie' } )
} )

export default router
