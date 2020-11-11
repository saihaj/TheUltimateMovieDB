/* eslint-disable import/prefer-default-export */
import { Schema } from 'mongoose'

/**
 * Create a relation
 * @param collectionName MongoDB collection name
 * @param require Default is true
 */
export const ObjectReference = ( collectionName: string, required = true ) => ( {
  type: Schema.Types.ObjectId,
  ref: collectionName,
  required,
} )
