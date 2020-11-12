import { Schema, SchemaTypes, model } from 'mongoose'
import 'mongoose-type-email'

import { ObjectReference } from '../utils/db'

const MovieReactionType = {
  count: {
    type: Number,
    required: false,
  },
  movies: ObjectReference( 'Movie', false ),
}

const UserSchema = new Schema( {
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [ 'regular', 'contributing' ],
    default: 'regular',
  },
  email: {
    // @ts-expect-error
    type: SchemaTypes.Email,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  moviesLoved: [ MovieReactionType ],
  moviesHates: [ MovieReactionType ],
} )

export default model( 'User', UserSchema )
