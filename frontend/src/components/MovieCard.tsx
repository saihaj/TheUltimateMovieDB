import React from 'react'
import { Link } from '@reach/router'
import cx from 'clsx'

export type MovieCardProps = {
  /**
   * Movie's Title
   */
  title: string;
  /**
   * Image URL for poster
   */
  posterUrl: string;
  /**
   * Movie's director
   */
  director: [{ name: string; _id: string }];
  releaseDate: string;
  movieId: string;
};

const MovieCard = ( {
  movieId,
  title,
  posterUrl,
  director,
  releaseDate,
}: MovieCardProps ) => (
  <div className="p-2 md:w-1/3">
    <Link to={movieId}>
      <div
        className={cx(
          'h-full overflow-hidden mx-auto',
          'border-gray-100 border-2 rounded-lg hover:border-yellow-400',
          'lg:w-11/12 md:w-full w-2/3',
        )}
      >
        <div
          style={{ height: 'inherit' }}
          className="flex flex-col justify-between"
        >
          <h1 className="text-3xl font-bold text-center">{title}</h1>
          <img src={posterUrl} alt={`Poster for ${title}`} />

          <div className="flex justify-between">
            <p className="text-lg ml-2 my-2">
              Director:
              {director.map( ( { name, _id: id } ) => (
                <b key={id}>{name}</b>
              ) )}
              <br />
              Released on: {releaseDate}
            </p>
          </div>
        </div>
      </div>
    </Link>
  </div>
)

export default MovieCard
