import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      user_type: string
      phone_number?: string
      governorate_id?: number
    }
    access_token?: string
  }

  interface User {
    id: string
    email: string
    name: string
    user_type: string
    phone_number?: string
    governorate_id?: number
    access_token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_type: string
    phone_number?: string
    governorate_id?: number
    access_token?: string
  }
}
