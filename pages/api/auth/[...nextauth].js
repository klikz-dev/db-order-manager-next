import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  providers: [
    CredentialsProvider({
      id: 'un-pw-login',
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const tokenRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dj-rest-auth/login/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            redirect: 'follow',
          }
        )
        const tokenData = await tokenRes.json()
        const token = tokenData.key

        if (token) {
          return token
        }
        return null
      },
    }),
  ],
  session: {
    jwt: true,
  },
  secret: process.env.JWT_SECRET_KEY,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
  },
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {
      session = token
      return session
    },
  },
})
