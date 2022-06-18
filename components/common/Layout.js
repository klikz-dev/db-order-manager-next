import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Divider from '../atoms/Divider'
import Loading from '../atoms/Loading'
import Footer from '../organisms/Footer'
import Header from '../organisms/Header'
import SideNav from '../organisms/SideNav'

export default function Layout({ children }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'authenticated') {
    if (session?.accessTokenExpires < new Date().getTime()) {
      signOut()
    } else {
      return (
        <>
          <Header />
          <main id='page-content'>
            <div className='flex'>
              <div id='sideNav' className='w-0 xl:w-auto'>
                <SideNav />
              </div>
              <div id='dashboard' className='min-h-full w-full py-16'>
                {children}
              </div>
            </div>
          </main>

          <Divider width={12} />
          <Footer />
        </>
      )
    }
  } else if (status === 'unauthenticated') {
    router.push('/')
  }

  return (
    <>
      <Header />
      <main id='page-content'>
        <div className='flex'>
          <Loading />
        </div>
      </main>
      <Footer />
    </>
  )
}
