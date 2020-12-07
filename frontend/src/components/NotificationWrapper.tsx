/* eslint-disable no-underscore-dangle */
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

import { AuthContext } from '../lib/auth'
import useInterval from '../lib/use-interval'

type NotificationWrapperProps = {
    children: ReactNode
}

const NotificationWrapper = ( { children }:NotificationWrapperProps ) => {
  const { state: { userId, isAuthenticated } } = useContext( AuthContext )
  const [ notifications, setNotifications ] = useState( [] )
  const { addToast } = useToasts()

  const removeNotification = async ( id:string ) => {
    await ( await fetch( `/api/notifications/read/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    } ) ).json()
  }

  //   Poll the API
  useInterval( () => {
    if ( isAuthenticated ) {
      fetch( `/api/notifications/${userId}` )
        .then( res => res.json() )
        .then( res => ( res.error >= 400 ? setNotifications( [] ) : setNotifications( res ) ) )
    }
  }, 5000 )

  useEffect( () => {
    if ( notifications ) {
      if ( notifications.length > 0 ) {
        notifications.forEach( ( a:any ) => {
          addToast( a.message, {
            appearance: 'info',
            autoDismiss: false,
            onDismiss: () => removeNotification( a._id ),
          } )
        } )
      }
    }
  }, [ notifications ] )

  return (
    <>
      {children}
    </>
  )
}

export default NotificationWrapper
