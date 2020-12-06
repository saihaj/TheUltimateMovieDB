import { Router } from 'express'
import { shuffle } from 'lodash';

import Models from '../../models'
import { DnE, GetItemById } from '../../utils/db'

const router = Router()

/**
 * Get recommended movies for a user
 */
router.get( '/:userId', async ( { params: { userId } }, res, next ) => {
  try {
    const user = await GetItemById( Models.User, userId )
    // Want to keep only unique movies
    const setOfMovies = new Set();

    if ( user ) {
      // Movies Liked
      user.moviesLoved.map( ( movieId:any ) => setOfMovies.add( movieId.toString() ) )

      // Recent 5 People they follow
      await Promise.all(
        user.followingPeople
          .reverse()
          .splice( 0, 5 )
          .map( ( personId:any ) => Models.People.findById( personId ) ),
      ).then( ( crew ) => {
        crew.forEach( ( m:any ) => {
          m.director.map( ( movieId:any ) => setOfMovies.add( movieId.toString() ) );
          m.actor.map( ( movieId:any ) => setOfMovies.add( movieId.toString() ) );
          m.writer.map( ( movieId:any ) => setOfMovies.add( movieId.toString() ) );
        } );
      } );

      await Promise.all(
        user.followingUser
          .reverse()
          .splice( 0, 15 )
          .map( ( personId:any ) => Models.User.findById( personId ) ),
      ).then( ( u ) => {
        u.forEach( ( m:any ) => {
          // add all movies liked by ppl they follow
          m.moviesLoved.map( ( movie:any ) => setOfMovies.add( movie.toString() ) );
          // remove all movies hated by ppl they follow
          m.moviesHates.map( ( movie:any ) => setOfMovies.delete( movie.toString() ) );
        } );
      } );

      // removed all movies hated
      user.moviesHates.map( ( movie:any ) => setOfMovies.delete( movie.toString() ) );

      // randomize movies and then select 20 for performance reasons
      const movies = await Promise.all(
        shuffle( [ ...setOfMovies ] )
          .slice( 0, 20 )
          .map( ( movieId:any ) => Models.MovieModel.findById( movieId ).populate( 'directors', 'name' ) ),
      );

      return res.json( movies )
    }

    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

export default router
