import { Schema, SchemaTypes, model } from 'mongoose'
import 'mongoose-type-email'

import { ObjectReference } from '../utils/db'

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
  followingUser: [ ObjectReference( 'User', false ) ],
  followingPeople: [ ObjectReference( 'People', false ) ],
  followers: [ ObjectReference( 'User', false ) ],
  moviesLoved: [ ObjectReference( 'Movie', false ) ],
  moviesHates: [ ObjectReference( 'Movie', false ) ],
} )

export default model( 'User', UserSchema )
