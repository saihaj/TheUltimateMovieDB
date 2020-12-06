/* eslint-disable no-underscore-dangle */
import { Link } from '@reach/router'
import React from 'react'
// @ts-expect-error missing types
import title from 'title'

type MovieReviewProps ={
  comment:string
  user:{_id: string, name:string}
}

const MovieReview = ( { comment, user }:MovieReviewProps ) => (
  <div className="border-gray-100 border-2 rounded-lg px-2 py-4 mb-2">
    <h3 className="text-2xl">
      {comment}
    </h3>
    <Link
      className="text-right flex justify-end hover:text-yellow-400"
      to={`/profile/${user._id}`}
    >
      By {title( user.name )}
    </Link>
  </div>
)

export default MovieReview
