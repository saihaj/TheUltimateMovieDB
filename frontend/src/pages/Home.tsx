import React, { FC, useEffect, useState } from 'react'

import { PageProps } from '../lib/types'

const HomePage:FC<PageProps> = () => {
  const [ data, setData ] = useState<{name:string}>()

  useEffect( () => {
    fetch( '/api/' )
      .then( res => res.json() )
      .then( res => setData( res ) )
  }, [] )

  return (
    <div className="flex flex-col m-2">
      <div className="mx-auto">
        <h1 className="text-3xl text-center font-bold">Homepage</h1>
        <h2 className="text-2xl text-center font-semibold pt-1">{ data && data!.name }</h2>
        <p className="text-xl py-5">
          This is create react app with typescript.
        </p>
      </div>
    </div>
  )
}

export default HomePage
