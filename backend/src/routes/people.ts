/* eslint-disable no-underscore-dangle */
import { Router } from 'express'

import Models from '../models'
import { DnE, GetItemById, NumChecking, EscapeRegex, NextOffset } from '../utils/db'

const router = Router()

type SearchParamPeople = {
  name?: String | RegExp;
};

/**
 * Get all people
 * Search params supported
 *   - name
 * query params
 *    - limit: default 10 max 50
 *    - offset: default 0
 * Sorted in Ascending order
 */
router.get( '/', async ( { query }, res, next ) => {
  try {
    const limit = NumChecking( parseInt( query.limit as string, 10 ), 10, 50 )
    const offset = NumChecking( parseInt( query.offset as string, 10 ), 0 )

    const searchParams: SearchParamPeople = {}

    if ( query.name ) {
      searchParams.name = new RegExp( EscapeRegex( query.name as string ), 'gi' )
    }

    const people = await Models.People.find( searchParams, null, {
      sort: { name: 1 },
      skip: offset,
      limit,
    } )

    // @ts-expect-error just counting all docs
    const upperbound = await Models.People.count()

    return res.json( {
      info: {
        limit,
        nextOffset: NextOffset( upperbound, limit, offset ),
      },
      results: people,
    } )
  } catch ( err ) {
    return next( err )
  }
} )

/**
 * Get person by ID
 */
router.get( '/:personId', async ( { params: { personId } }, res, next ) => {
  try {
    const person = await GetItemById( Models.People, personId )

    if ( person ) {
      const moviesSet = new Set()

      ;[ ...person.director, ...person.writer, ...person.actor ]
        .map( ( id ) => moviesSet.add( id.toString() ) )

      const tempMovies = await Promise.all(
        [ ...moviesSet ].map( async ( id ) => Models.MovieModel.findById( id ).populate( 'directors' ) ),
      )

      return res.json( { name: person.name, movies: tempMovies, _id: person._id } )
    }

    return next( DnE( personId ) );
  } catch ( err ) { return next( err ) }
} )

/**
 * Add a person to DB
 *  - name: string
 *  - director?: [Movie ObjectId]
 *  - actor?: [Movie ObjectId]
 *  - writer?: [Movie ObjectId]
 */
router.post( '/', async ( { body }, res, next ) => {
  try {
    const person = new Models.People( { ...body } )
    const savePerson = await person.save()
    return res.json( savePerson.toJSON() )
  } catch ( err ) { return next( err ) }
} )

export default router
