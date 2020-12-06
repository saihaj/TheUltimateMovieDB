/* eslint-disable no-underscore-dangle */
import React, { FC, useContext } from 'react'
import { useParams } from '@reach/router'
import useSWR from 'swr'
import { useToasts } from 'react-toast-notifications'
import clsx from 'clsx'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'
import MovieCard, { MovieCardProps } from '../../components/MovieCard'
import { AuthContext } from '../../lib/auth'

type ProfileDataProps = {
  name: string;
  movies: [{
      _id: string;
      title: MovieCardProps['title'];
      poster: MovieCardProps['posterUrl'];
      directors: MovieCardProps['director'];
      meta: { releaseDate: string };
    }]
}

const FollowPerson = () => {
  const { state: { userId } } = useContext( AuthContext )
  const { personId } = useParams()
  const { addToast } = useToasts()

  const makeApiCall = async ( type: 'follow'| 'unfollow' ) => {
    const res = await ( await fetch( `/api/users/${type}/person/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        personId,
      } ),
    } ) ).json()

    addToast( res.message, {
      appearance: res.error >= 400 ? 'error' : 'info',
      autoDismiss: true,
    } )
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        className={clsx(
          'bg-gray-400 text-indigo-800',
          'px-6 py-1 rounded-lg',
          'hover:bg-yellow-400',
          'mr-10',
        )}
        onClick={() => makeApiCall( 'follow' )}
      >
        Follow
      </button>
      <button
        type="button"
        className={clsx(
          'bg-gray-400 text-indigo-800',
          'px-4 py-1 rounded-lg',
          'hover:bg-yellow-400',
        )}
        onClick={() => makeApiCall( 'unfollow' )}
      >
        Unfollow
      </button>
    </div>
  )
}

const ProfileData = ( { name, movies }: ProfileDataProps ) => {
  const { state: { isAuthenticated } } = useContext( AuthContext )

  return (
    <div className="mt-8">
      <div className="my-auto">
        <h1 className="text-5xl text-center font-medium">{name}</h1>

        {isAuthenticated && <FollowPerson />}

        <div className="md:flex md:flex-wrap max-w-3xl mx-auto">
          {movies.map( a => (
            <MovieCard
              key={a._id}
              movieId={a._id}
              title={a.title}
              posterUrl={a.poster}
              director={a.directors}
              releaseDate={a.meta.releaseDate}
            />
          ) )}
        </div>
      </div>
    </div>
  )
}
const Profile: FC<PageProps> = () => {
  const { personId } = useParams()
  const { data } = useSWR( `/api/people/${personId}` )

  return (
    <Layout nav>
      {!data && <div>Loading...</div>}
      {data?.error && (
      <h1 className="text-center text-3xl pt-16">
        We have a problem! User not found
      </h1>
      )}
      {!data?.error && data && (
      <ProfileData name={data.name} movies={data.movies} />
      )}
    </Layout>
  )
}

export default Profile
