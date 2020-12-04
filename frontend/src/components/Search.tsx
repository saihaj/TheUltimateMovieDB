/* eslint-disable no-underscore-dangle */
import React, { useState, DetailedHTMLProps, InputHTMLAttributes, useEffect } from 'react'
import clsx from 'clsx'
import { Link } from '@reach/router'

type SearchBoxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const SearchBox = ( { ...props }: SearchBoxProps ) => {
  const [ searchValue, setSearchValue ] = useState( '' )
  const [ results, setResults ] = useState( [] )

  const handleChange = ( event:React.ChangeEvent<HTMLInputElement> ) => {
    setSearchValue( event.target.value )
  }

  useEffect( () => {
    if ( searchValue.length >= 2 && searchValue !== ' ' ) {
      fetch( `/api/movies?title=${searchValue}` )
        .then( res => res.json() )
        .then( res => setResults( res ) )
    }
  }, [ searchValue ] )

  return (
    <>
      <input
        className={clsx(
          'w-4/6 px-4 py-1',
          'text-black',
          'rounded-t-lg font-medium',
        )}
        value={searchValue}
        onChange={handleChange}
        placeholder="Search Movies"
        {...props}
      />
      <div className={clsx(
        'w-4/6 px-4 py-1',
        'rounded-b-lg font-medium',
        'bg-white text-black',
      )}
      >
        {results.map( ( a:{_id:string;title:string} ) => (
          <div key={a._id} className="divide-y-4 divide-teal-800">
            <Link className="hover:text-purple-900" to={`/movies/${a._id}`}>{a.title}</Link>
          </div>
        ) )}
      </div>
    </>
  )
}

export default SearchBox
