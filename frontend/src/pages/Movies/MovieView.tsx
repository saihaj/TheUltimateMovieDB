import React, { FC } from 'react'
import { useParams, Link } from '@reach/router'
import useSWR from 'swr'
// @ts-expect-error ignore types for this
import ReactJoin from 'react-join'

import { PageProps } from '../../lib/types'
import Layout from '../../components/Layout'

type PeopleNamesProps = {
  list: [{ _id: string; name: string }];
};

type MovieComponentProps = {
  title: string;
  posterUrl: string;
  directors: PeopleNamesProps['list'];
  actors: PeopleNamesProps['list'];
  writers: PeopleNamesProps['list'];
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

const MovieComponent = ( {
  title,
  posterUrl,
  directors,
  actors,
  writers,
}: MovieComponentProps ) => (
  <div className="md:flex">
    <img
      alt={`Posted of ${title}`}
      src={posterUrl}
      className="lg:w-1/2 md:w-2/5 w-4/6 rounded-lg mx-auto md:mx-0 md:pr-10"
    />
    <div className="flex flex-col my-auto text-center md:text-left">
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
      </h3>
    </div>
  </div>
)

const MovieView: FC<PageProps> = () => {
  const { movieId } = useParams()
  const { data, error } = useSWR( `/api/movies/${movieId}` )
  return (
    <Layout nav>
      {!error && !data && <div>Loading...</div>}
      {error && (
      <h1 className="text-center text-3xl pt-16">
        We have a problem! Movie not found
      </h1>
      )}
      {data && (
      <div className="max-w-3xl mx-auto pt-32">
        <MovieComponent
          title={data.title}
          posterUrl={data.poster}
          directors={data.directors}
          actors={data.actors}
          writers={data.writers}
        />
      </div>
      )}
    </Layout>
  )
}

export default MovieView
