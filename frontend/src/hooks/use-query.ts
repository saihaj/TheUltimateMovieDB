import { useLocation } from '@reach/router'

/**
 * Get the query params from search bar
 */
const useQuery = ( queryParam:string ) => {
  const { search } = useLocation()
  const searchParams = new URLSearchParams( search )
  return searchParams.get( queryParam )
}

export default useQuery
