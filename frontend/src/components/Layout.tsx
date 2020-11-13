import React, { ReactNode } from 'react'

import Navbar from './Navbar'

type LayoutProps = {
  children: ReactNode
  /**
   * Hidden by default
   */
  nav?: boolean
}

const Layout = ( { children, nav = false }: LayoutProps ) => (
  <>
    {nav && <Navbar />}
    <main className="max-w-6xl mx-auto md:px-10 px-2 pt-2 ">
      {children}
    </main>
  </>
)

export default Layout
