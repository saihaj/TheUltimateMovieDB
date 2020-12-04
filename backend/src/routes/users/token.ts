import { Router } from 'express'
import jwt from 'jsonwebtoken'

import Models from '../../models'
import { DnE, GetItemById } from '../../utils/db'
import { createToken } from '../../utils/auth'
import { JWT_SECRET, REFRESH_TOKEN_EXPIRY } from '../../utils/consts'

const router = Router()

/**
 * Create a new access token using refresh token
 * Input: {token:string}
 */
router.post( '/', ( { body }, res, next ) => {
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
 * Input: {tokens: {refresh: string, access: string}}
 *
 */
router.post( '/update', async ( { body }, res, next ) => {
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
router.post( '/decode', ( { body }, res, next ) => {
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
