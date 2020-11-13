import React, { ComponentType } from 'react'

import { PageProps } from '../lib/types'

import Layout from './Layout'
import LinkButton from './LinkButton'

const NotAllowed: ComponentType<PageProps> = () => (
  <Layout>
    <div className="text-center mt-32">
      <h2 className="text-3xl">
        You are not allowed on this page
      </h2>
      <LinkButton to="/" label="Go back home" />
    </div>
  </Layout>
)

export default NotAllowed
