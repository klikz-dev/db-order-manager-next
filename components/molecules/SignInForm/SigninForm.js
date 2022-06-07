import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import Input from '@/components/atoms/Input'
import Logo from '../Logo'

export default function SigninForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e && e.preventDefault()

    signIn('un-pw-login', { email, password })
  }

  useEffect(() => {
    if (router.query.error === 'CredentialsSignin') {
      setError('Invalid username or password.')
    }
  }, [router.query.error])

  return (
    <div className='px-12 py-8 bg-white rounded shadow-lg'>
      <Logo />

      <h3 className='text-black text-xl font-bold mt-6 mb-3'>Order Manager</h3>

      <form
        className='mt-4 mb-4 flex flex-col items-start gap-4 rounded w-72'
        onSubmit={handleLogin}
      >
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='Your Email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id='password'
          name='password'
          type='password'
          placeholder='Your Password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input type='submit' value='Sign in' />

        {error && <p className='text-red'>{error}</p>}
      </form>
    </div>
  )
}
