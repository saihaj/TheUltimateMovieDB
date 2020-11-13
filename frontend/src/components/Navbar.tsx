import React, { useContext } from 'react'
import { Link } from '@reach/router'

import { AuthContext } from '../lib/auth'

import LinkButton from './LinkButton'

const Navbar = () => {
  const { state: { isAuthenticated, name, userId } } = useContext( AuthContext )

  return (
    <nav className="p-2 mr-8 flex flex-row-reverse">
      {isAuthenticated && (
      <div>
        <Link to={`/profile/${userId}`} className="hover:text-yellow-400">{name}</Link>
      </div>
      )}

      {!isAuthenticated && (
        <div>
          <LinkButton to="/login" label="Login" />
        </div>
      )}
    </nav>
  )
}

export default Navbar
