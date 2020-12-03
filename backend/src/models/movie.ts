import { Schema, model } from 'mongoose';

import { ObjectReference } from '../utils/db';

const MovieSchema = new Schema( {
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  production: {
    type: String,
    required: true,
  },
  genre: [
    {
      type: String,
      required: true,
      index: true,
    },
  ],
  meta: ObjectReference( 'MovieMeta' ),
  // directors: [ String ],
  // actors: [ String ],
  // writers: [ String ],
  directors: [ ObjectReference( 'People' ) ],
  actors: [ ObjectReference( 'People' ) ],
  writers: [ ObjectReference( 'People' ) ],
} )

export const MovieModel = model( 'Movie', MovieSchema )

const VotesType = {
  count: Number,
  users: [ ObjectReference( 'User', false ) ],
}

const MovieReviewSchema = new Schema( {
  user: ObjectReference( 'User' ),
  comment: String,
  downvotes: VotesType,
  upvotes: VotesType,
} )

export const MovieReviewModel = model( 'MovieReview', MovieReviewSchema );

const MovieRatingsSchema = new Schema( {
  downvotes: VotesType,
  upvotes: VotesType,
} )

export const MovieRatingsModel = model( 'MovieRating', MovieRatingsSchema )

const MovieMetaSchema = new Schema( {
  plot: String,
  language: String,
  country: String,
  releaseDate: String,
  metaScore: Number,
  // reviews: ObjectReference( 'MovieReview' ),
  // ratings: ObjectReference( 'MovieRating' ),
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
  MovieRatingsSchema,
  MovieMetaModel,
}
