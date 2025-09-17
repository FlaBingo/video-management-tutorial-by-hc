import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { connectToDatabase } from "./db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com"},
        password: { label: "Password", type: "password", placeholder: "********"}
      },
      authorize: async (credentials) => {
        if(!credentials?.email || !credentials?.password){
          throw new Error("Missing email or password")
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email})
          if(!user){
            throw new Error("No user found.")
          }
          const isValid = await bcrypt.compare(credentials.password as string, user.password as string);
          if(!isValid) {
            throw new Error("Invalid password")
          }
          return {
            id: user._id.toString(),
            email: user.email
          }
        } catch (error) {
          console.error("Auth error", error)
          throw error
        }
      }
    })
  ],
})