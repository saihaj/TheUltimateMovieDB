import { Schema, QueryPopulateOptions, Model } from 'mongoose'

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

/**
 * Return an object from DB
 * @param {MongooseModel} schema Mongoose Schema to query DB
 * @param {string} id The ID for the blog to query
 * @param {QueryPopulateOptions} populateFields Any subfields to populate
 * @returns {Object} with the data or null
 */
export const GetItemById = async (
  schema: Model<any>,
  id: string,
  populateFields?:QueryPopulateOptions,
) => schema
  .findById( id )
  .select( '-__v' )
  .populate( populateFields )

/**
 * Return an array of object from DB
 * @param {MongooseModel} schema Mongoose Schema to query DB
 * @param {QueryPopulateOptions} populateFields Any subfields to populate
 * @returns {Object} with the data or null
 */
export const GetAll = async (
  schema: Model<any>,
  populateFields?:QueryPopulateOptions,
) => schema
  .find()
  .select( '-__v' )
  .populate( populateFields )

/**
 * Helper Function to throw an 404
 * @param {String} id
 * @returns 404 error
 */
export const DnE = ( id: string ) => ( { message: `${id} does not exist`, status: 404 } )

/**
 * Return a number satisfying upper bounds
 * @param input
 * @param def default value
 * @param max upper bound
 */
export const NumChecking = ( input:number, def:number, max?: number ) => {
  if ( max ) {
    if ( input > max ) return def
  }

  if ( input > 0 ) return input
  return def
}

/**
 * Cleanup a string
 * @param text input to process
 */
export const EscapeRegex = ( text:string ) => text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&' )

/**
 * Return next offset
 * @param upperbound
 * @param limit
 * @param offset
 */
export const NextOffset = ( upperbound: number, limit: number, offset: number ) => (
  ( offset + limit < upperbound ) ? offset + limit : upperbound )
