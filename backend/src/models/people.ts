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
  collaborators: [ {
    person: ObjectReference( 'People', false ),
    count: Number,
  } ],
} )

export default model( 'People', PersonSchema )
