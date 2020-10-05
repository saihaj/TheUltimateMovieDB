import React, { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}

const Layout = ( { children }: LayoutProps ) => (
  <main className="max-w-6xl mx-auto md:px-10 px-2 pt-2 ">
    {children}
  </main>
)

export default Layout
