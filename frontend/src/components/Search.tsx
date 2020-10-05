import React, { useState, DetailedHTMLProps, InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type SearchBoxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const SearchBox = ( { ...props }: SearchBoxProps ) => {
  const [ searchValue, setSearchValue ] = useState( '' )

  return (
    <input
      className={clsx(
        'w-4/6 px-4 py-1 ',
        'text-black',
        'rounded-lg font-medium',
      )}
      value={searchValue}
      onChange={e => setSearchValue( e.target.value )}
      placeholder="Search Movies"
      {...props}
    />
  )
}

export default SearchBox
