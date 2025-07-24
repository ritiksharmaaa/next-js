import {  NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import {Facebook} from "next-auth/providers/facebook"
// import {Github} from "next-auth/providers/github"
// import {Google} from "next-auth/providers/google"
import bcrypt from "bcryptjs";
import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";



export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "username" },
        password: {
          label: "password",
          type: "password",
          placeholder: "enter password",
        },
      },
      async authorize(credentials: any ): Promise<any> {
        // here we are getting whatevery user type in the field of imput .
        // we can access credentials.username and credentials.password to get and do authentication .
        await dbConnected();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User not found");
          }
          // if user have we need to check whether it verfied or not
          if (!user.isVerified) {
            throw new Error("User is not verified");
          }
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // .if password is valid now we have to create session and jwt token .
          return user; //this return directly goes to provider now they manage how do session and jwt token handel . they nextauth handel it one you return a user to it after authenticate .
        } catch (error) {
          console.log("Error in authorize function: ", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],

  //  here callback call to send data to user suppose user give creditian now we have to send jwt token or we have to first save the session and also send to user . as well after login where to redirect user . suppose if fail to create jwt or seeeion we thorugh error that we can not create session or jwt token . write now plese try after  sometime .
  callbacks: {
    async jwt({ token, user }) {
      // here we get jwt token and user data came from whcih e return in provider .
      // in token we have just user id but we want to more data like username and email so we can add that to token .
      if (user) {
        token._id = user._id?.toString(); // check .d.ts file
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessages;
        // you alll give this in session /also next auth most work on seesion based stdg.
      }
      return token;
    },
    async session({ session, token }) {
      // here we get session and token . we can add more data to session like username and email .

      // for that  you have to overirght type od sesssion and token also for that
      if (token) {
        session.user._id = token._id?.toString(); // check .d.ts file
        session.user.isAcceptingMessages = token.isAcceptingMessage;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username; // this is optional you can add or not .
      }
      return session;
    },
  },
  // note . here why pages  becuase when provider redirect where when so we decide to when auht hit to please redirec this url in case of .

  pages: {
    // here  you decide where to route the user bascally url for auth . we have default api/auth/signin but we haev also option to change it .
    // bydefault  signIn : "/auth/signin", we can oveerride it to our custom page . why .
    // becuase we choose to cistom signin that why we create own url or route but if not custom sign up and sign in  than it direclty go to api/auth/signin . fro all other provider lije google , github , facebook etc .
    signIn: "/sign-in", // this automaticla  go to auth/route there we mange how to deal . what pages to show what not and all that .
  },
  // we can choose stattegy or jwt .
  session: {
    strategy: "jwt", // we can also use database session but we choose jwt .
    //  you have to tell secret to encypt for jwt token . or for cretign session .
  },
  secret: process.env.SESSION_SECRET, // this is secret for session and jwt token .
};
