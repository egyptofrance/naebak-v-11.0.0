import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Call our auth service
          const response = await fetch('https://naebak-auth-service-822351033.uc.r.appspot.com/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const result = await response.json()

          if (response.ok && result.access_token) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.full_name,
              user_type: result.user.user_type,
              phone_number: result.user.phone_number,
              governorate_id: result.user.governorate_id,
              access_token: result.access_token
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_type = user.user_type
        token.phone_number = user.phone_number
        token.governorate_id = user.governorate_id
        token.access_token = user.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.user.user_type = token.user_type
      session.user.phone_number = token.phone_number
      session.user.governorate_id = token.governorate_id
      session.access_token = token.access_token
      return session
    }
  },
  pages: {
    signIn: '/',
    signUp: '/',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }
