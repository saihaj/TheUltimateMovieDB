import { Router } from 'express'
import { v4 } from 'uuid'

import Models from '../models'
import dataset from '../movie-data'
import { NumChecking, EscapeRegex, GetItemById, DnE } from '../utils/db'

const router = Router()

type SearchParamMovies = {
  year?:string
  title?:string | RegExp
  genre?:string
}

/**
 * Get all movies
 * Search params supported
 *   - title
 *   - genre
 *   - year
 * query params
 *    - limit: default 10 max 50
 *    - offset: default 0
 * Ascending order
 * For Return type of object see `MovieSchema`
 */
router.get( '/', async ( { query }, res, next ) => {
  try {
    const limit = NumChecking( parseInt( query.limit as string, 10 ), 10, 50 )
    const offset = NumChecking( parseInt( query.offset as string, 10 ), 0 )

    const searchParams:SearchParamMovies = {}

    if ( query.year ) {
      searchParams.year = query.year as string
    }

    if ( query.title ) {
      searchParams.title = new RegExp( EscapeRegex( query.title as string ), 'gi' )
    }

    if ( query.genre ) {
      searchParams.genre = query.genre as string
    }

    const movies = await Models.MovieModel
      .find( searchParams, null, { sort: { title: 1 }, skip: offset, limit } ).populate( 'meta directors' )

    return res.json( {
      info: {
        limit,
        nextOffset: offset + limit,
      },
      results: movies,
    } );
  } catch ( err ) { return next( err ) }
} )

/**
 * Get movie by ID
 * For Return type of object see `MovieSchema`
 */
router.get( '/:movie', async ( { params: { movie } }, res, next ) => {
  try {
    // @ts-expect-error populate type errors
    const movieObj = await GetItemById( Models.MovieModel, movie, 'directors actors writers' )
    if ( movieObj ) return res.json( movieObj );
    return next( DnE( movie ) );
  } catch ( err ) { return next( err ) }
} )

// Post a movie
router.post( '/', ( { body }, res ) => {
  const input = { id: v4(), ...body }
  dataset.push( input )
  res.status( 200 ).json( { message: 'Successfully added the movie' } )
} )

export default router
