import { useEffect, useRef } from 'react'

function useInterval( callback:() => any, delay:number ) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect( () => {
    // @ts-expect-error not so strong types here
    savedCallback.current = callback
  }, [ callback ] )

  // eslint-disable-next-line consistent-return
  useEffect( () => {
    function tick() {
      // @ts-expect-error not so strong types here
      savedCallback.current()
    }
    if ( delay !== null ) {
      const id = setInterval( tick, delay )
      return () => clearInterval( id )
    }
  }, [ delay ] )
}

export default useInterval

