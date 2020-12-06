/* eslint-disable no-underscore-dangle */
import { Router } from 'express'

import Models from '../../models'
import { GetItemById, DnE } from '../../utils/db'

const router = Router()

/**
 * Get review on movie by ID
 * For Return type of object see `[MovieReviewSchema]`
 */
router.get( '/:movie', async ( { params: { movie } }, res, next ) => {
  try {
    const ratings = await Models.MovieRatingsModel.find( { movie } ).populate( 'upvotes downvotes' )

    if ( ratings ) return res.json( ratings )

    return next( DnE( movie ) )
  } catch ( err ) { return next( err ) }
} )

/**
 * Rate a given movie
 * For Return type of object see `MovieRatingSchema`
 */
router.patch( '/upvote/:movie', async ( { params: { movie }, body }, res, next ) => {
  if ( !body.user ) return next( { message: '`user` is a required field.', status: 412 } );

  try {
    const movieObj = await GetItemById( Models.MovieModel, movie )
    if ( movieObj ) {
      const rateMe = await Models.MovieRatingsModel.findOne( { movie } )

      // Create new
      if ( !rateMe ) {
        const rating = await new Models.MovieRatingsModel( {
          movie,
          upvotes: [ body.user ],
        } ).save()

        // Add to movie collection
        await Models.MovieModel.findByIdAndUpdate(
          { _id: movieObj._id },
          { $set: { ratings: rating } },
        ).exec()

        // Update the current user
        await Models.User.findByIdAndUpdate(
          { _id: body.user },
          { $push: { moviesLoved: movieObj._id } },
        ).exec()

        return res.json( { message: `Thanks for liking ${movieObj.title}` } )
      }

      const didDownvote = await Models.MovieRatingsModel
        .findById( { _id: rateMe._id } )
        .where( 'downvotes' ).equals( body.user )

      // remove downvote
      if ( didDownvote ) {
        await Models.MovieRatingsModel.findOneAndUpdate(
          { _id: rateMe._id },
          { $pullAll: { downvotes: [ body.user ] } },
        ).exec()

        await Models.User.findByIdAndUpdate(
          { _id: body.user },
          { $pullAll: { moviesHates: [ movieObj._id ] } },
        ).exec()
      }

      const shouldUpvote = await Models.MovieRatingsModel
        .findById( { _id: rateMe._id } )
        .where( 'upvotes' ).ne( body.user )

      // Already voted
      if ( !shouldUpvote ) {
        return res.json( { message: 'You already voted' } )
      }

      // Cast vote
      await Models.MovieRatingsModel.findByIdAndUpdate(
        { _id: rateMe._id },
        { $push: { upvotes: body.user } },
      ).exec()

      // Add to user
      await Models.User.findByIdAndUpdate(
        { _id: body.user },
        { $push: { moviesLoved: movieObj._id } },
      ).exec()

      return res.json( { message: `Thanks for liking ${movieObj.title}` } )
    }
    return next( DnE( movie ) );
  } catch ( err ) { return next( err ) }
} )

/**
 * Rate a given movie
 * For Return type of object see `MovieRatingSchema`
 */
router.patch( '/downvote/:movie', async ( { params: { movie }, body }, res, next ) => {
  if ( !body.user ) return next( { message: '`user` is a required field.', status: 412 } );

  try {
    const movieObj = await GetItemById( Models.MovieModel, movie )
    if ( movieObj ) {
      const rateMe = await Models.MovieRatingsModel.findOne( { movie } )

      // Create new
      if ( !rateMe ) {
        const rating = await new Models.MovieRatingsModel( {
          movie,
          downvote: [ body.user ],
        } ).save()

        // Add to movie collection
        await Models.MovieModel.findByIdAndUpdate(
          { _id: movieObj._id },
          { $set: { ratings: rating } },
        ).exec()

        // Update the current user
        await Models.User.findByIdAndUpdate(
          { _id: body.user },
          { $push: { moviesHates: movieObj._id } },
        ).exec()

        return res.json( { message: `We hope you find peace after disliking ${movieObj.title}` } )
      }

      const didUpvote = await Models.MovieRatingsModel
        .findById( { _id: rateMe._id } )
        .where( 'upvotes' ).equals( body.user )

      // remove upvote
      if ( didUpvote ) {
        await Models.MovieRatingsModel.findOneAndUpdate(
          { _id: rateMe._id },
          { $pullAll: { upvotes: [ body.user ] } },
        ).exec()

        await Models.User.findByIdAndUpdate(
          { _id: body.user },
          { $pullAll: { moviesLoved: [ movieObj._id ] } },
        ).exec()
      }

      const shouldDownvote = await Models.MovieRatingsModel
        .findById( { _id: rateMe._id } )
        .where( 'downvotes' ).ne( body.user )

      // Already voted
      if ( !shouldDownvote ) {
        return res.json( { message: 'You already voted' } )
      }

      // Cast vote
      await Models.MovieRatingsModel.findByIdAndUpdate(
        { _id: rateMe._id },
        { $push: { downvotes: body.user } },
      ).exec()

      // Add to user
      await Models.User.findByIdAndUpdate(
        { _id: body.user },
        { $push: { moviesHates: movieObj._id } },
      ).exec()

      return res.json( { message: `We hope you find peace after disliking ${movieObj.title}` } )
    }
    return next( DnE( movie ) );
  } catch ( err ) { return next( err ) }
} )

export default router
