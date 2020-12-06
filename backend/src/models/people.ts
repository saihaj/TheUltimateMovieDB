import { Schema, model } from 'mongoose'

import { ObjectReference } from '../utils/db'

const PersonSchema = new Schema( {
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  director: [ ObjectReference( 'Movie', false ) ],
  writer: [ ObjectReference( 'Movie', false ) ],
  actor: [ ObjectReference( 'Movie', false ) ],
  followers: [ ObjectReference( 'User', false ) ],
} )

export default model( 'People', PersonSchema )
