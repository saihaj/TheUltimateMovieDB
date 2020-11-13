import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'

import Models from '../models'
import { DnE, GetItemById, GetAll } from '../utils/db'
import { createToken } from '../utils/auth'
import { JWT_SECRET, REFRESH_TOKEN_EXPIRY } from '../utils/consts'

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

    res.json( { ...retrievedUser.toJSON(), token } )
  } catch ( err ) { return new Error( err ) }
} )

/**
 * Create a new access token using refresh token
 * Input: {token:string}
 */
router.post( '/token', ( { body }, res, next ) => {
  if ( !body.token ) {
    return next( { message: 'Missing refresh token', status: 403 } )
  }

  // @ts-expect-error
  const accessToken = jwt.verify( body.token, JWT_SECRET, ( err, user ) => {
    if ( err ) {
      return next( { message: 'Invalid refresh token', status: 403 } )
    }

    const { name, userId, role } = user
    return createToken( name, userId, role, JWT_SECRET, '15min' )
  } )

  res.cookie( 'access-token', accessToken )
  return res.json( { token: accessToken } )
} )

/**
 * Generate new set of tokens
 * Input: {token: {refresh: string, access: string}}
 *
 */
router.post( '/token/update', async ( { body }, res, next ) => {
  if ( !body.tokens ) {
    return next( { message: 'Missing tokens', status: 403 } )
  }

  // @ts-expect-error
  const userId = jwt.verify( body.tokens.refresh, JWT_SECRET, ( err, user ) => {
    if ( err ) {
      return next( { message: 'Invalid refresh token', status: 403 } )
    }
    return user.userId
  } ) as string

  try {
    const user = await GetItemById( Models.User, userId )

    if ( user ) {
      // Create tokens
      const token = {
        access: createToken( user.name, user.id, user.role, JWT_SECRET, '15min' ),
        refresh: createToken( user.name, user.id, user.role, JWT_SECRET, '7d' ),
      }

      // Set tokens
      res.cookie( 'access-token', token.access )
      res.cookie( 'refresh-token', token.refresh, { maxAge: REFRESH_TOKEN_EXPIRY } )
      // Can be useful in frontend
      res.cookie( 'user-role', user.role )

      return res.json( { ...user.toJSON(), token } )
    }
    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

/**
 * Decode values of tokens
 * Input: {token:string}
 */
router.post( '/token/decode', ( { body }, res, next ) => {
  if ( !body.token ) {
    return next( { message: 'Missing token', status: 403 } )
  }

  // @ts-expect-error
  const accessToken = jwt.verify( body.token, JWT_SECRET, ( err, user ) => {
    if ( err ) {
      return next( { message: 'Invalid token', status: 403 } )
    }
    return user
  } )

  return res.json( accessToken )
} )

export default router
