import { Router } from 'express'

import Models from '../models'
import { DnE, GetItemById, GetAll } from '../utils/db'

const router = Router()

/**
 * Get all people
 */
router.get( '/', async ( _, res, next ) => {
  try {
    const person = await GetAll( Models.People )
    return res.json( person );
  } catch ( err ) { return next( err ) }
} )

/**
 * Get person by ID
 */
router.get( '/:personId', async ( { params: { personId } }, res, next ) => {
  try {
    const person = await GetItemById( Models.People, personId )
    if ( person ) return res.json( person );
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
