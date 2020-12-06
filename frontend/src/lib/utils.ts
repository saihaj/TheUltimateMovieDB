/**
 * Returns an array from list items
 * @param {String} list comma separated list
 */
export const List = ( list:string|[string] ) => {
  if ( !list ) return []
  if ( Array.isArray( list ) ) return list
  return list.split( ',' ).map( word => word.trim() ) || list
}
