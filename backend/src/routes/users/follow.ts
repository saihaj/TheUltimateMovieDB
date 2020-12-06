import { Router } from 'express'

import Models from '../../models'
import { DnE, GetItemById } from '../../utils/db'

const router = Router()

/**
 * Follow a user
 * Required:
 *  - userId: ObjectID of user to follow
 */
router.post( '/user/:userId', async ( { params: { userId }, body }, res, next ) => {
  if ( !body.userId ) return next( { message: '`userId` is a required field.', status: 412 } );

  try {
    const user = await GetItemById( Models.User, userId )
    const followUser = await GetItemById( Models.User, body.userId )

    if ( user && followUser ) {
      if ( userId === body.userId ) return next( { message: 'You can\'t follow yourself', status: 400 } )

      // make sure user is not following followUser
      const shouldNotFollow = await Models.User
        .findById( { _id: userId } )
        .where( 'followingUser' ).equals( body.userId )
      if ( shouldNotFollow ) return next( { message: `You are already following ${followUser.name}`, status: 400 } )

      // add followUser to followingUser list for user
      await Models.User.findByIdAndUpdate(
        { _id: userId },
        { $push: { followingUser: body.userId } },
      )

      // add user to followers list of followUser
      await Models.User.findByIdAndUpdate(
        { _id: body.userId },
        { $push: { followers: userId } },
      )

      return res.json( { message: `${user.name} started following ${followUser.name}` } )
    }

    return next( DnE( 'one of the user' ) )
  } catch ( err ) { return next( err ) }
} )

/**
 * Follow a person
 * Required:
 *  - personId: ObjectID of person to follow
 */
router.post( '/person/:userId', async ( { params: { userId }, body }, res, next ) => {
  if ( !body.personId ) return next( { message: '`personId` is a required field.', status: 412 } );
  const { personId } = body

  try {
    const user = await GetItemById( Models.User, userId )
    const followPerson = await GetItemById( Models.People, personId )

    if ( user && followPerson ) {
      // make sure user is not following followPerson
      const shouldNotFollow = await Models.User
        .findById( { _id: userId } )
        .where( 'followingPeople' ).equals( personId )

      if ( shouldNotFollow ) return next( { message: `You are already following ${followPerson.name}`, status: 400 } )

      // add followPerson to followingPeople list for user
      await Models.User.findByIdAndUpdate(
        { _id: userId },
        { $push: { followingPeople: personId } },
      )

      return res.json( { message: `${user.name} started following ${followPerson.name}` } )
    }

    return next( DnE( 'user or person' ) )
  } catch ( err ) { return next( err ) }
} )

export default router
