import React, { ReactNode } from 'react'

import './tailwind.output.css'

interface WrapperProps {
  children: ReactNode
}

/**
 * Wrapper function for different Context Providers that should be available globally
 */
const GlobalWrapper = ( { children }:WrapperProps ) => (
  <>
    {children}
  </>
)

export default GlobalWrapper
