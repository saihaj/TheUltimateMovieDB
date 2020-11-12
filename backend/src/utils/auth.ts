/* eslint-disable import/prefer-default-export */
import { sign } from 'jsonwebtoken'

/**
 * Helper function to create JWT tokens
 */
export const createToken = (
  /**
   * User name to insert in token
   */
  name:string,
  /**
   * ID in USER DOC (mongo)
   */
  userId:string,
  role: string,
  tokenSecret:string,
  expiryTime:string,
) => sign( { name, userId, role }, tokenSecret, { expiresIn: expiryTime } )
