import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { omit } from 'lodash'

import Models from '../../models'
import { DnE, GetItemById, GetAll } from '../../utils/db'
import { createToken } from '../../utils/auth'
import { JWT_SECRET, REFRESH_TOKEN_EXPIRY } from '../../utils/consts'

import Tokens from './token'
import Follow from './follow'
import UnFollow from './unfollow'

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

// Change user role
router.patch( '/:userId/role', async ( { params: { userId } }, res, next ) => {
  try {
    const user = await GetItemById( Models.User, userId )
    if ( user ) {
      const role = user.role === 'contributing' ? 'regular' : 'contributing'

      const updatedUser = await Models.User.updateOne(
        { _id: userId }, { role }, ( err, updated ) => {
          if ( err ) return next( err )
          return updated
        },
      )

      return res.json( { ...updatedUser, role } )
    }
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

router.post( '/login', async ( { body }, res, next ) => {
  try {
    const { email } = body
    if ( !body.email || !body.password ) return next( { message: 'Missing email/password field', status: 400 } )

    // Grab user from DB
    const retrievedUser = await Models.User.findOne( { email } )
    if ( !retrievedUser ) return next( { message: 'User does not exist', status: 404 } )

    // @ts-expect-error
    const { name, _id: id, role, password: hashedPassword } = retrievedUser

    // Compare passwords
    const checkPassword = await bcrypt.compare( body.password, hashedPassword )
    if ( !checkPassword ) return next( { message: 'Incorrect password', status: 401 } )

    // Create tokens
    const token = {
      access: createToken( name, id, role, JWT_SECRET, '15min' ),
      refresh: createToken( name, id, role, JWT_SECRET, '7d' ),
    }

    // Set tokens
    res.cookie( 'access-token', token.access )
    res.cookie( 'refresh-token', token.refresh, { maxAge: REFRESH_TOKEN_EXPIRY } )
    // Can be useful in frontend
    res.cookie( 'user-role', role )

    return res.json( { ...retrievedUser.toJSON(), token } )
  } catch ( err ) { return new Error( err ) }
} )

router.use( '/token', Tokens )

router.use( '/follow', Follow )

router.use( '/unfollow', UnFollow )

/**
 * Get all the followers for a given user
 */
router.get( '/followers/:userId', async ( { params: { userId } }, res, next ) => {
  try {
    const user = await Models.User.findById( userId )
      .select( 'followers name' )
      .populate( 'followers' )

    if ( user ) return res.json( user )
    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

/**
 * Get all the following for a given user
 */
router.get( '/following/:userId', async ( { params: { userId } }, res, next ) => {
  try {
    const user = await Models.User.findById( userId )
      .select( 'followingUser followingPeople name' )
      .populate( 'followingUser followingPeople' )

    if ( user ) return res.json( user )
    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

export default router
