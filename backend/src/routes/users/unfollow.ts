import { Router } from 'express'

import Models from '../../models'
import { DnE, GetItemById } from '../../utils/db'

const router = Router()

router.post( '/user/:userId', async ( { params: { userId }, body }, res, next ) => {
  if ( !body.userId ) return next( { message: '`userId` is a required field.', status: 412 } );

  try {
    const user = await GetItemById( Models.User, userId )
    const followUser = await GetItemById( Models.User, body.userId )

    if ( user && followUser ) {
      // make sure user is following followUser
      const shouldNotUnfollow = await Models.User
        .findById( { _id: userId } )
        .where( 'followingUser' ).ne( body.userId )

      if ( shouldNotUnfollow ) return next( { message: `You are not following ${followUser.name}`, status: 400 } )

      // remove followUser from followingUser list for user
      await Models.User.findByIdAndUpdate(
        { _id: userId },
        { $pullAll: { followingUser: [ body.userId ] } },
      )

      // remove user from followers list of followUser
      await Models.User.findByIdAndUpdate(
        { _id: body.userId },
        { $pullAll: { followers: [ userId ] } },
      )

      return res.json( { message: `${user.name} unfollowed ${followUser.name}` } )
    }

    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

router.post( '/person/:userId', async ( { params: { userId }, body }, res, next ) => {
  if ( !body.personId ) return next( { message: '`personId` is a required field.', status: 412 } );
  const { personId } = body

  try {
    const user = await GetItemById( Models.User, userId )
    const followPerson = await GetItemById( Models.People, body.personId )

    if ( user && followPerson ) {
      // make sure user is following followPerson
      const shouldUnfollow = await Models.User
        .findById( { _id: userId } )
        .where( 'followingPeople' ).equals( personId )

      if ( !shouldUnfollow ) return next( { message: `You are not even following ${followPerson.name}`, status: 400 } )

      // remove followPerson from followingPeople list for user
      await Models.User.findByIdAndUpdate(
        { _id: userId },
        { $pullAll: { followingPeople: [ personId ] } },
      )

      return res.json( { message: `${user.name} unfollowed ${followPerson.name}` } )
    }

    return next( DnE( userId ) )
  } catch ( err ) { return next( err ) }
} )

export default router
