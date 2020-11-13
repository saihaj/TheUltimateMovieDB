import React, { FC, useContext, useEffect } from 'react'

import { PageProps } from '../lib/types'
import Layout from '../components/Layout'
import LinkButton from '../components/LinkButton'
import { AuthContext, AUTH_ACTIONS } from '../lib/auth'

const MePage: FC<PageProps> = () => {
  const { state, dispatch } = useContext( AuthContext )

  useEffect( () => {
    dispatch( { type: AUTH_ACTIONS.login } )
  }, [ dispatch ] )

  return (
    <Layout>
      {!state.isAuthenticated && (
        <div className="text-center mt-32">
          <h2 className="text-3xl">
            You are not logged in.
          </h2>
          <LinkButton to="/login" label="Login" />
        </div>
      )}
      {state.isAuthenticated && (
      <div className="text-center mt-32">
        <h2 className="text-3xl">
          Hey {state.name}
        </h2>
        <LinkButton to={`/profile/${state.userId}`} label="Continue to profile" />
      </div>
      )}
    </Layout>
  )
}

export default MePage
