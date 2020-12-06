/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import clsx from 'clsx'

type ActionButtonProps = {
  /**
   * onClick Handler
   */
  action: () => void,
  label: string
  customStyle?: string
}

const ActionButton = ( { action, label, customStyle }:ActionButtonProps ) => (
  <div
    className={clsx(
      'bg-gray-400 text-indigo-800',
      'px-4 py-1 rounded-lg',
      'hover:bg-yellow-400',
      customStyle,
    )}
    style={{ cursor: 'pointer' }}
    onClick={action}
  >
    {label}
  </div>
)

export default ActionButton
