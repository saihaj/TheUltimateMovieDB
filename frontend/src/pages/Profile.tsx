/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useContext, useEffect } from 'react'
import { Link, useParams } from '@reach/router'
import useSWR, { mutate } from 'swr'
import clsx from 'clsx'

import { PageProps } from '../lib/types'
import Layout from '../components/Layout'
import LinkButton from '../components/LinkButton'
import { AuthContext, AUTH_ACTIONS, parseCookies } from '../lib/auth'

const DummyContribData = () => (
  <>
    <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
      <h3 className="text-xl text-center font-medium">Top 5 recent Likes</h3>
      <div className="text-lg border-gray-400 border-2 rounded-lg flex flex-col">
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/1">Toy Story</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/10">GoldenEye</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/7">Sabrina</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/asdf">Anatomy Park</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/515">Pilot</Link>
      </div>
    </div>

    <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
      <h3 className="text-xl text-center font-medium">Top 5 recent Contributions</h3>
      <div className="text-lg border-gray-400 border-2 rounded-lg flex flex-col">
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Anchor Gear">Anchor Gear</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Mortynight Run">Mortynight Run</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Close Rick-counters of the Rick Kind">Close Rick-counters of the Rick Kind</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/Heat">Heat</Link>
        <Link className="ml-2 py-2 hover:text-yellow-400" to="/movies/2">Jumanji</Link>
      </div>
    </div>
  </>

)

type UserProfileDataProps = {
  name: string;
  userRole: string;
}

const UserDataFetch = ( { name, userRole }: UserProfileDataProps ) => (
  <div className="flex justify-around mt-8">
    <img className="rounded-full h-56" src="https://via.placeholder.com/300" alt="Dummy Profile Pic" />

    <div className=" my-auto">
      <h1 className="text-4xl font-medium">{name}</h1>
      <h3 className="text-lg">Role: {userRole}</h3>
    </div>
  </div>
)

const ContributorEditOptions = () => (
  <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
    <h2 className="text-2xl pb-2">Contributing User Perks</h2>
    <LinkButton to="/people/create" label="Add new person" />
  </div>
)

type ActionButtonProps = {
  action: () => void,
  label: string
}

const ActionButton = ( { action, label }:ActionButtonProps ) => (
  <div
    className={clsx(
      'bg-gray-400 text-indigo-800',
      'px-4 py-1 rounded-lg',
      'hover:bg-yellow-400',
    )}
    style={{ cursor: 'pointer' }}
    onClick={action}
  >
    {label}
  </div>
)

const ProfileEditOptions = () => {
  const { state: { userId }, dispatch } = useContext( AuthContext )

  const changeRole = async () => {
    await fetch( `/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    } )

    const cookies = parseCookies()
    // @ts-expect-error
    const refreshToken = cookies[ 'refresh-token' ]
    // @ts-expect-error
    const accessToken = cookies[ 'access-token' ]
    fetch( '/api/users/token/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        tokens: { refresh: refreshToken, access: accessToken },
      } ),
    } )
      .then( () => dispatch( { type: AUTH_ACTIONS.reLogin } ) )
      .catch( err => alert( err ) )
  }

  return (
    <div className="flex flex-col w-full mt-8 md:w-1/2 px-4">
      <h2 className="text-2xl pb-2">Edit Profile</h2>
      <ActionButton action={changeRole} label="Change Role" />
      <ActionButton action={() => dispatch( { type: AUTH_ACTIONS.logout } )} label="Logout" />
    </div>
  )
}

const UserProfile: FC<PageProps> = () => {
  const { userId } = useParams()
  const { data } = useSWR( `/api/users/${userId}` )
  const { state: { isAuthenticated, role } } = useContext( AuthContext )

  useEffect( () => {
    mutate( `/api/users/${userId}` )
  }, [ role, userId ] )

  return (
    <Layout nav>
      {!data && <div>Loading...</div>}
      {data?.error && <h1 className="text-center text-3xl pt-16">We have a problem! User not found</h1>}
      {!data?.error && data && (
      <>
        <UserDataFetch name={data.name} userRole={data.role} />
        <div className="flex flex-col md:flex-row justify-around">
          <DummyContribData />
        </div>
        <div className="flex flex-col md:flex-row justify-around">
          {isAuthenticated && <ProfileEditOptions />}
          {role === 'contributing' && <ContributorEditOptions />}
        </div>
      </>
      )}
    </Layout>
  )
}
export default UserProfile
