import { Schema, model } from 'mongoose'

import { ObjectReference } from '../utils/db'

const NotificationSchema = new Schema( {
  to: ObjectReference( 'User' ),
  message: {
    type: String,
    required: true,
  },
  movie: ObjectReference( 'Movie' ),
} );

export default model( 'Notifications', NotificationSchema )
