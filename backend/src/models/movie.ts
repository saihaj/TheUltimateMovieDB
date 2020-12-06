import { Schema, model } from 'mongoose';

import { ObjectReference } from '../utils/db';

const MovieScore = {
  total: {
    type: Number,
    default: 0,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
    required: true,
  },
  average: {
    type: Number,
    default: 0,
    required: true,
  },
}

const MovieSchema = new Schema( {
  title: {
    type: String,
    required: true,
  },
  year: String,
  poster: String,
  production: String,
  genre: [
    {
      type: String,
      required: true,
      index: true,
    },
  ],
  meta: ObjectReference( 'MovieMeta' ),
  reviews: [ ObjectReference( 'MovieReview' ) ],
  ratings: ObjectReference( 'MovieRating', false ),
  // directors: [ String ],
  // actors: [ String ],
  // writers: [ String ],
  directors: [ ObjectReference( 'People' ) ],
  actors: [ ObjectReference( 'People' ) ],
  writers: [ ObjectReference( 'People' ) ],
  score: MovieScore,
} )

export const MovieModel = model( 'Movie', MovieSchema )

const MovieReviewSchema = new Schema( {
  user: ObjectReference( 'User' ),
  movie: ObjectReference( 'Movie' ),
  comment: {
    type: String,
    required: true,
  },
} )

export const MovieReviewModel = model( 'MovieReview', MovieReviewSchema );

const MovieRatingsSchema = new Schema( {
  movie: ObjectReference( 'Movie' ),
  downvotes: [ ObjectReference( 'User' ) ],
  upvotes: [ ObjectReference( 'User' ) ],
} )

export const MovieRatingsModel = model( 'MovieRating', MovieRatingsSchema )

const MovieMetaSchema = new Schema( {
  plot: String,
  language: String,
  country: String,
  releaseDate: String,
  metaScore: Number,
  imdb: {
    imdbId: String,
    votes: Number,
    rating: Number,
  },
} )

export const MovieMetaModel = model( 'MovieMeta', MovieMetaSchema )

export default {
  MovieModel,
  MovieReviewModel,
  MovieRatingsModel,
  MovieMetaModel,
}
