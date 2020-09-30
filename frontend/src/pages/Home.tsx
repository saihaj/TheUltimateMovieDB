import React, { FC } from 'react'

import { PageProps } from '../lib/types'

const HomePage:FC<PageProps> = () => (
  <div className="flex flex-col m-2">
    <div className="mx-auto">
      <h1 className="text-3xl text-center font-bold">Homepage</h1>
      <p className="text-xl py-5">
        This is create react app with typescript.
      </p>
    </div>
  </div>
)

export default HomePage
