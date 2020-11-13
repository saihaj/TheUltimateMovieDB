import { createContext, Dispatch } from 'react'
import jwtDecode from 'jwt-decode'

type AuthState = {
  isAuthenticated: boolean;
  userId: string | undefined;
  role: string | undefined;
  name: string | undefined;
};

type AuthActionType = {
  type: 'LOGIN' | 'RE_LOGIN' |'LOGOUT';
};

export enum AUTH_ACTIONS {
  login = 'LOGIN',
  reLogin = 'RE_LOGIN',
  logout = 'LOGOUT'
}

export const initialAuthState = {
  isAuthenticated: false,
  userId: undefined,
  role: undefined,
  name: undefined,
}

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthActionType>;
}>( { state: initialAuthState, dispatch: () => null } )

export const login = async ( email: string, password: string ) => fetch( '/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify( {
    email,
    password,
  } ),
} )

export const parseCookies = () => document.cookie.split( ';' ).reduce( ( res, c ) => {
  const [ key, val ] = c.trim().split( '=' ).map( decodeURIComponent )
  try {
    return Object.assign( res, { [ key ]: JSON.parse( val ) } )
  } catch ( e ) {
    return Object.assign( res, { [ key ]: val } )
  }
}, {} )

const deleteAllCookies = () => {
  const cookies = document.cookie.split( ';' )
  for ( let i = 0; i < cookies.length; i += 1 ) {
    const cookie = cookies[ i ]
    const eqPos = cookie.indexOf( '=' )
    const name = eqPos > -1 ? cookie.substr( 0, eqPos ) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

export const authReducer = (
  state: AuthState,
  action: AuthActionType,
): AuthState => {
  switch ( action.type ) {
    case AUTH_ACTIONS.login: {
      const cookies = parseCookies()
      // @ts-expect-error
      const accessToken = cookies[ 'access-token' ]
      if ( !accessToken ) return state

      // Too much work to get typechecking to work on JWT
      // @ts-expect-error
      const { userId, role, name } = jwtDecode( accessToken )
      return {
        isAuthenticated: true,
        userId,
        role,
        name,
      }
    }
    case AUTH_ACTIONS.reLogin: {
      const cookies = parseCookies()
      // @ts-expect-error
      const refreshToken = cookies[ 'refresh-token' ]
      if ( !refreshToken ) return state

      //   Too much work to get typechecking to work on JWT
      // @ts-expect-error
      const { userId, role, name } = jwtDecode( refreshToken )
      return {
        isAuthenticated: true,
        userId,
        role,
        name,
      }
    }
    case AUTH_ACTIONS.logout: {
      deleteAllCookies()
      return initialAuthState
    }
    default:
      return state
  }
}
