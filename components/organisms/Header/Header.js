/* eslint-disable @next/next/no-html-link-for-pages */
import Button from '@/components/atoms/Button'
import Transition from '@/components/atoms/Transition'
import Logo from '@/components/molecules/Logo'
import { Popover } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import Avatar from 'react-avatar'

export default function Header({ title }) {
  const { data: session } = useSession()

  return (
    <div className='px-4 py-2 shadow'>
      <div className='max-w-screen-2xl mx-auto flex flex-row justify-between items-center space-x-12'>
        <a href='/'>
          <Logo />
        </a>

        <h1>{title}</h1>

        <div className='flex space-x-8 items-end mt-2'>
          <a href='/orders' className='font-bold text-lg'>
            Manage Orders
          </a>

          <a href='/order-processor' className='font-bold text-lg'>
            Process Orders
          </a>

          <a href='/sample-processor' className='font-bold text-lg'>
            Process Samples
          </a>
        </div>

        <Popover className='relative'>
          <Popover.Button>
            <Avatar
              email={session?.email}
              name={`${session?.first_name} ${session?.last_name}`}
              size={40}
              round={true}
              className=''
            />
          </Popover.Button>

          <Transition>
            <Popover.Panel className='absolute right-0 top-10 rounded shadow-lg w-64 bg-white border px-4 py-6 z-10'>
              <p className='text-blue-800 font-bold mb-4'>{session?.email}</p>

              <p className='text-black text-lg font-bold mb-4'>{`${session?.first_name} ${session?.last_name}`}</p>

              <Button onClick={signOut}>Sign out</Button>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  )
}
