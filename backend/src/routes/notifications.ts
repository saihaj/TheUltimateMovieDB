import { Router } from 'express'

import Models from '../models'

const router = Router()

/**
 * Get notifications for given user
 */
router.get( '/:userId', async ( { params: { userId } }, res, next ) => {
  try {
    const notifications = await Models.Notifications.find( { to: userId } );

    if ( notifications ) {
      if ( notifications.length >= 1 ) {
        return res.json( notifications );
      }
    }

    return next( { message: `Couldn't find notifications for ${userId}`, status: 404 } );
  } catch ( err ) { return next( err ); }
} );

/**
 * Mark a notification as read
 */
router.delete( '/read/:notificationId', async ( { params: { notificationId } }, res, next ) => {
  try {
    const notifications = await Models.Notifications.findByIdAndDelete( notificationId );

    if ( notifications ) {
      return res.json( { message: 'Marked as read' } );
    }

    return next( { message: 'Couldn\'t find notification', status: 404 } );
  } catch ( err ) { return next( err ); }
} );

export default router
