import Button from '@/components/atoms/Button'
import Logo from '@/components/molecules/Logo'
import { signOut } from 'next-auth/react'

export default function Header() {
  return (
    <div className='px-4 py-2 shadow'>
      <div className='max-w-screen-2xl mx-auto flex flex-row justify-between items-center space-x-12'>
        <Logo />

        <h1>Order Manger</h1>

        <Button onClick={signOut}>Sign out</Button>
      </div>
    </div>
  )
}
