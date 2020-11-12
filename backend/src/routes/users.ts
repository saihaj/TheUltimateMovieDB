import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { omit } from 'lodash'

import Models from '../models'
import { DnE, GetItemById, GetAll } from '../utils/db'

const router = Router()

/**
 * Get all users
 */
router.get( '/', async ( _, res, next ) => {
  try {
    const users = await GetAll( Models.User )
    return res.json( users );
  } catch ( err ) { return next( err ) }
} )

// Get user by ID
router.get( '/:userId', async ( { params: { userId } }, res, next ) => {
  try {
    const user = await GetItemById( Models.User, userId )
    if ( user ) return res.json( user )
    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

/**
 * Add a user
 * Provide
 *   - name: string
 *   - email: string
 *   - password: string
 *   - role?: ['regular','contributing']
 *   - moviesHated?: [{ count?: number, movies?: Movie ObjectId }]
 *   - moviesLoved?: [{ count?: number, movies?: Movie ObjectId }]
 */
router.post( '/', async ( { body }, res, next ) => {
  try {
    const hashedPassword = await bcrypt.hash( body.password, 10 )

    const user = new Models.User( {
      ...body,
      password: hashedPassword,
    } );

    const saveUser = await user.save()

    return res.json( {
      ...omit( saveUser.toJSON(), [ 'password', '__v' ] ),
    } )
  } catch ( err ) { return next( err ) }
} )

export default router
