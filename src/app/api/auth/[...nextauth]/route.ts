import NextAuth from "next-auth/next";
import { authOption } from "./options";


const handler = NextAuth(authOption) // here similar by put bracket we have to  add diffren diffrent auth provider likek google , github . facbook and all that .

export { handler as GET, handler as POST } // here we are exporting the handler for both GET and POST requests. NextAuth will handle the session and authentication logic based on the options provided.