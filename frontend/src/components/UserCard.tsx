import React from 'react'
import { Link } from '@reach/router'
import cx from 'clsx'

type UserCardProps = {
/**
 * Name to display
 */
  name: string
  /**
   * href target in website
   */
  to: string
}

const UserCard = ( { to, name }: UserCardProps ) => (
  <div className="p-2 md:w-1/3">

    <Link to={to}>

      <div
        className={cx(
          'h-full overflow-hidden mx-auto',
          'border-gray-100 border-2 rounded-lg hover:border-yellow-400',
          'lg:w-11/12 md:w-full w-2/3',
        )}
      >
        <div style={{ height: 'inherit' }} className="flex flex-col justify-between">

          <h1 className="text-3xl font-bold text-center">{name}</h1>

        </div>
      </div>

    </Link>

  </div>
)

export default UserCard
