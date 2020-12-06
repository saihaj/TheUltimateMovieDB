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
    const user = await GetItemById( Models.User, body.user )

    if ( movieObj && user ) {
      const review = await new Models.MovieReviewModel(
        { user: body.user, comment: body.comment, movie: movieObj._id },
      ).save()

      await Models.MovieModel.findByIdAndUpdate(
        { _id: movieObj._id },
        { $push: { reviews: review } },
      ).exec()

      // Notify followers
      await Promise.all( user.followers.map( async ( id:string ) => new Models.Notifications( {
        to: id,
        message: `${user.name} just added a review for ${movieObj.title}`,
        movie: movieObj._id,
      } ).save() ) );

      return res.json( review )
    }

    return next( DnE( 'Provided Movie or User' ) );
  } catch ( err ) { return next( err ) }
} )

/**
 * Get review on movie by ID
 * For Return type of object see `[MovieReviewSchema]`
 */
router.get( '/:movie', async ( { params: { movie } }, res, next ) => {
  try {
    const reviews = await Models.MovieReviewModel
      .find( { movie } )
      .populate( 'user', 'name' )

    if ( reviews ) {
      if ( reviews.length >= 1 ) {
        return res.json( reviews.reverse() )
      }
    }

    return next( DnE( movie ) )
  } catch ( err ) { return next( err ) }
} )

export default router
