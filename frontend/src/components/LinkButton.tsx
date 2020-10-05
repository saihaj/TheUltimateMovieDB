import React from 'react'
import { Link, AnchorProps } from '@reach/router'
import cx from 'clsx'

type NavItemProps = {
    /**
     * Value that Link should show
     */
    label: string
    to: string
    /**
     * Additional `className` to apply to defaults
     */
    customStyles?: string
} & Omit<AnchorProps, 'children' | 'ref' | 'className'>

const NavItem = ( { to, label, customStyles, ...props }: NavItemProps ) => (
  <Link
    to={to}
    className={cx(
      'bg-gray-400 text-indigo-800',
      'px-4 py-1 rounded-lg',
      'hover:bg-yellow-400',
      `${customStyles}`,
    )}
    {...props}
  >
    {label}
  </Link>
)
export default NavItem
