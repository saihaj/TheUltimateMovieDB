/* eslint-disable no-underscore-dangle */
import React, { FC, useContext, useState } from 'react'
import { useParams, Link } from '@reach/router'
import useSWR, { mutate } from 'swr'
import { AiTwotoneDislike, AiTwotoneLike } from 'react-icons/ai'
import ReactStars from 'react-rating-stars-component'
import ReactJoin from 'react-join'
import { useToasts } from 'react-toast-notifications'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'
import { AuthContext } from '../../lib/auth'
import ActionButton from '../../components/ProfileActionButton'
import MovieReview from '../../components/MovieReview'
import MovieCard, { MovieCardProps } from '../../components/MovieCard'

type PeopleNamesProps = {
  list: [{ _id: string; name: string }];
};

type MovieComponentProps = {
  title: string;
  posterUrl: string;
  directors: PeopleNamesProps['list'];
  actors: PeopleNamesProps['list'];
  writers: PeopleNamesProps['list'];
  genre: [string];
};

const PeopleNames = ( { list }: PeopleNamesProps ) => (
  <ReactJoin separator={<span>, </span>}>
    {list.map( ( { _id: id, name } ) => (
      <Link className="hover:text-yellow-400" to={`/people/${id}`} key={id}>
        {name}
      </Link>
    ) )}
  </ReactJoin>
)

const Reaction = () => {
  const {
    state: { userId },
  } = useContext( AuthContext )
  const { movieId } = useParams()
  const { addToast } = useToasts()

  const makeApiCall = async ( type: 'upvote' | 'downvote' ) => {
    const res = await (
      await fetch( `/api/movies/rating/${type}/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          user: userId,
        } ),
      } )
    ).json()

    addToast( res.message, {
      appearance: res.error >= 400 ? 'error' : 'info',
      autoDismiss: true,
    } )
  }
  return (
    <>
      <AiTwotoneLike
        className="hover:text-yellow-400"
        style={{ cursor: 'pointer' }}
        size={30}
        onClick={() => makeApiCall( 'upvote' )}
      />
      <AiTwotoneDislike
        className="hover:text-yellow-400"
        style={{ cursor: 'pointer' }}
        size={30}
        onClick={() => makeApiCall( 'downvote' )}
      />
    </>
  )
}

const WriteReview = () => {
  const [ givenReview, setGivenReview ] = useState( false )
  const [ review, setReview ] = useState( '' )
  const { movieId } = useParams()
  const { addToast } = useToasts()
  const {
    state: { userId },
  } = useContext( AuthContext )
  const submitReview = async () => {
    if ( review.length > 0 ) {
      const res = await (
        await fetch( `/api/movies/review/${movieId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( {
            comment: review,
            user: userId,
          } ),
        } )
      ).json()

      setReview( '' )
      setGivenReview( true )
      mutate( `/api/movies/review/${movieId}` )
      addToast( res.error >= 400 ? res.message : 'Thanks for the review!', {
        appearance: res.error >= 400 ? 'error' : 'info',
        autoDismiss: true,
      } )
    } else {
      addToast( 'Please write something', {
        appearance: 'error',
        autoDismiss: true,
      } )
    }
  }
  return (
    <div className="pt-8">
      {givenReview && (
        <h3 className="text-2xl text-center text-gray-400">
          Thanks for writing the review
        </h3>
      )}
      {!givenReview && (
        <>
          <textarea
            placeholder="Write review"
            value={review}
            onChange={e => setReview( e.target.value )}
            className="form-input mt-2 block w-full rounded-t-lg text-black bg-gray-400"
          />
          <ActionButton
            label="Submit Review"
            customStyle="rounded-t-none"
            action={() => submitReview()}
          />
        </>
      )}
    </div>
  )
}

const MovieComponent = ( {
  title,
  posterUrl,
  directors,
  actors,
  writers,
  genre,
}: MovieComponentProps ) => {
  const {
    state: { isAuthenticated },
  } = useContext( AuthContext )
  return (
    <div className="md:flex">
      <img
        alt={`Posted of ${title}`}
        src={posterUrl}
        className="lg:w-1/2 md:w-2/5 w-4/6 rounded-lg mx-auto md:mx-0 md:pr-10"
      />
      <div className="flex flex-col my-auto text-center md:text-left">
        <div className="flex justify-center pt-4 md:justify-start md:pt-0">
          {isAuthenticated && <Reaction />}
        </div>

        <h1 className="text-5xl font-bold">{title}</h1>
        <h3 className="text-2xl font-medium">
          <b>Director: </b>
          <PeopleNames list={directors} />
          <br />
          <b>Actors: </b>
          <PeopleNames list={actors} />
          <br />
          <b>Writers: </b>
          <PeopleNames list={writers} />
          <br />
          <b>Genre: </b>
          <ReactJoin separator={<span>, </span>}>
            {genre.map( a => (
              <Link className="hover:text-yellow-400" to={`/movies?genre=${a}`}>
                {a}
              </Link>
            ) )}
          </ReactJoin>
        </h3>
      </div>
    </div>
  )
}

const MovieView: FC<PageProps> = () => {
  const { movieId } = useParams()
  const { data, error } = useSWR( `/api/movies/${movieId}` )
  const {
    state: { isAuthenticated },
  } = useContext( AuthContext )
  const { data: reviewsData } = useSWR( `/api/movies/review/${movieId}` )
  const { data: similarMovies } = useSWR(
    data && `/api/movies/${movieId}/similar`,
  )

  const setReview = async ( score: number ) => {
    if ( isAuthenticated ) {
      await (
        await fetch( `/api/movies/score/${movieId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( {
            score,
          } ),
        } )
      ).json()
    }
  }

  return (
    <Layout nav>
      {!error && !data && <div>Loading...</div>}
      {error && (
        <h1 className="text-center text-3xl pt-16">
          We have a problem! Movie not found
        </h1>
      )}

      {data && (
        <>
          <div className="max-w-3xl mx-auto pt-16">
            <MovieComponent
              title={data.title}
              posterUrl={data.poster}
              directors={data.directors}
              actors={data.actors}
              writers={data.writers}
              genre={data.genre}
            />
          </div>

          <div className="flex justify-between max-w-3xl mx-auto pt-8">
            <h4 className="text-2xl text-gray-400">Rating</h4>
            <div className="pl-2">
              <ReactStars
                count={10}
                value={Math.round( data.score.average )}
                onChange={( newRating: number ) => setReview( newRating )}
                size={35}
                activeColor="#f6e05e"
                color="#6562e3"
              />
            </div>
          </div>

          {isAuthenticated && <WriteReview />}

          <div className="pt-10 pb-4">
            {reviewsData && reviewsData.length > 0 && (
              <>
                <h2 className="text-3xl pb-2 text-center">User Reviews</h2>
                <div className="overflow-y-scroll h-48">
                  {reviewsData.map(
                    ( a: {
                      _id: string;
                      comment: string;
                      user: { _id: string; name: string };
                    } ) => (
                      <MovieReview
                        key={a._id}
                        comment={a.comment}
                        user={a.user}
                      />
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          <div className="pt-10 pb-4">
            {similarMovies && similarMovies.length > 0 && (
              <>
                <h2 className="text-3xl pb-2 text-center">Similar Movies</h2>
                <div className="md:flex md:flex-wrap">
                  {similarMovies.map(
                    ( a: {
                      _id: MovieCardProps['movieId'];
                      title: MovieCardProps['title'];
                      poster: MovieCardProps['posterUrl'];
                      directors: MovieCardProps['director'];
                      meta: { releaseDate: MovieCardProps['releaseDate'] };
                    } ) => (
                      <MovieCard
                        key={a._id}
                        movieId={a._id}
                        title={a.title}
                        posterUrl={a.poster}
                        director={a.directors}
                        releaseDate={a.meta.releaseDate}
                      />
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}

export default MovieView
