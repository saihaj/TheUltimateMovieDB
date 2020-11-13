import { createContext, Dispatch } from 'react'
import jwtDecode from 'jwt-decode'

type AuthState = {
  isAuthenticated: boolean;
  userId: string | undefined;
  role: string | undefined;
  name: string | undefined;
};

type AuthActionType = {
  type: 'LOGIN';
};

export enum AUTH_ACTIONS {
  login = 'LOGIN',
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

const parseCookies = () => document.cookie.split( ';' ).reduce( ( res, c ) => {
  const [ key, val ] = c.trim().split( '=' ).map( decodeURIComponent )
  try {
    return Object.assign( res, { [ key ]: JSON.parse( val ) } )
  } catch ( e ) {
    return Object.assign( res, { [ key ]: val } )
  }
}, {} )

export const authReducer = (
  state: AuthState,
  action: AuthActionType,
): AuthState => {
  switch ( action.type ) {
    case AUTH_ACTIONS.login: {
      const cookies = parseCookies()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const accessToken = cookies[ 'access-token' ]
      if ( !accessToken ) return state

      //   Too much work to get typechecking to work on JWT
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const { userId, role, name } = jwtDecode( accessToken )
      return {
        isAuthenticated: true,
        userId,
        role,
        name,
      }
    }
    default:
      return state
  }
}
