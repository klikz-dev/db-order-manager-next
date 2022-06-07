import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import Loading from '@/components/atoms/Loading'
import SignInForm from '@/components/molecules/SignInForm'

export default function Page() {
  const router = useRouter()

  const { data: session, status } = useSession()

  if (status === 'authenticated') {
    if (session?.accessTokenExpires < new Date().getTime()) {
      signOut()
    } else {
      router.push('/orders')
    }
  } else if (status === 'unauthenticated') {
    return (
      <div className='w-screen h-screen bg-zinc-100 flex items-center justify-center'>
        <div className='max-w-xl mx-auto px-4 py-4'>
          <SignInForm />
        </div>
      </div>
    )
  }

  return <Loading />
}
