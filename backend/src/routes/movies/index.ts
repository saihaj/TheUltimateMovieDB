/* eslint-disable no-underscore-dangle */
import { Router } from 'express';
import { v4 } from 'uuid';

import Models from '../../models';
import dataset from '../../movie-data';
import { NumChecking, EscapeRegex, GetItemById, DnE, NextOffset } from '../../utils/db';

import Ratings from './ratings';
import Reviews from './review';

const router = Router();

type SearchParamMovies = {
  year?: string;
  title?: string | RegExp;
  genre?: string;
  'score.average'?: { $gte: number };
};

/**
 * Get all movies
 * Search params supported
 *   - title
 *   - genre
 *   - year
 *   - minrating
 * query params
 *    - limit: default 10 max 50
 *    - offset: default 0
 * Ascending order
 * For Return type of object see `MovieSchema`
 */
router.get( '/', async ( { query }, res, next ) => {
  try {
    const limit = NumChecking( parseInt( query.limit as string, 10 ), 10, 50 );
    const offset = NumChecking( parseInt( query.offset as string, 10 ), 0 );

    const searchParams: SearchParamMovies = {};

    if ( query.year ) {
      searchParams.year = query.year as string;
    }

    if ( query.title ) {
      searchParams.title = new RegExp( EscapeRegex( query.title as string ), 'gi' );
    }

    if ( query.genre ) {
      searchParams.genre = query.genre as string;
    }

    if ( query.minrating ) {
      searchParams[ 'score.average' ] = {
        $gte: parseInt( query.minrating as string, 10 ),
      };
    }

    const movies = await Models.MovieModel.find( searchParams, null, {
      sort: { title: 1 },
      skip: offset,
      limit,
    } ).populate( 'meta directors' );

    // @ts-expect-error just counting all docs
    const upperbound = await Models.MovieModel.count()

    return res.json( {
      info: {
        limit,
        nextOffset: NextOffset( upperbound, limit, offset ),
      },
      results: movies,
    } );
  } catch ( err ) {
    return next( err );
  }
} );

/**
 * Get movie by ID
 * For Return type of object see `MovieSchema`
 */
router.get( '/:movie', async ( { params: { movie } }, res, next ) => {
  try {
    const movieObj = await GetItemById(
      Models.MovieModel,
      movie,
      // @ts-expect-error populate type errors
      'directors actors writers',
    );
    if ( movieObj ) return res.json( movieObj );
    return next( DnE( movie ) );
  } catch ( err ) {
    return next( err );
  }
} );

// Post a movie
router.post( '/', ( { body }, res ) => {
  const input = { id: v4(), ...body };
  dataset.push( input );
  res.status( 200 ).json( { message: 'Successfully added the movie' } );
} );

/**
 * Score a movie
 * For Return type of object see `MovieSchema`
 */
router.patch(
  '/score/:movie',
  async ( { params: { movie }, body }, res, next ) => {
    if ( !body.score ) return next( { message: '`score` is a required field.', status: 412 } );
    if ( body.score > 10 || body.score < 0 ) {
      return next( {
        message: '`score` needs to be between 0-10.',
        status: 412,
      } );
    }

    try {
      const movieObj = await GetItemById( Models.MovieModel, movie );

      if ( movieObj ) {
        const newScore = movieObj.score.total + +body.score;
        const newCounter = movieObj.score.count + 1;
        const newAvg = newScore / newCounter;

        await Models.MovieModel.findByIdAndUpdate(
          { _id: movie },
          {
            $set: {
              score: {
                total: newScore,
                count: newCounter,
                average: newAvg,
              },
            },
          },
        ).exec();

        return res.json( { message: `Average score is ${newAvg}` } );
      }

      return next( { message: `${movie} does not exist`, status: 404 } );
    } catch ( err ) {
      return next( err );
    }
  },
);

router.use( '/rating', Ratings );
router.use( '/review', Reviews );

export default router;
