/* eslint-disable no-underscore-dangle */
import { Router } from 'express'

import Models from '../../models'
import { GetItemById, DnE } from '../../utils/db'

const router = Router()

/**
 * Write review for a given movie
 * For Return type of object see `MovieReviewSchema`
 */
router.post( '/:movie', async ( { params: { movie }, body }, res, next ) => {
  try {
    const movieObj = await GetItemById( Models.MovieModel, movie )

    if ( movieObj ) {
      const review = await new Models.MovieReviewModel(
        { user: body.user, comment: body.comment, movie: movieObj._id },
      ).save()

      await Models.MovieModel.findByIdAndUpdate(
        { _id: movieObj._id },
        { $push: { reviews: review } },
      ).exec()

      return res.json( review )
    }

    return next( DnE( movie ) );
  } catch ( err ) { return next( err ) }
} )

/**
 * Get review on movie by ID
 * For Return type of object see `[MovieReviewSchema]`
 */
router.get( '/:movie', async ( { params: { movie } }, res, next ) => {
  try {
    const reviews = await Models.MovieReviewModel.find( { movie } ).populate( 'user' )

    if ( reviews ) {
      if ( reviews.length >= 1 ) {
        return res.json( reviews )
      }
    }

    return next( DnE( movie ) )
  } catch ( err ) { return next( err ) }
} )

export default router
