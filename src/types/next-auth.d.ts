import "next-auth"
import { DefaultSession } from "next-auth";


//  what we are doing here actual when in callback next-auth try to sedn user with there defien type where user._id is not defien . so we know every type is used from a central file so we do what get the  type from that  fule and overright bro we want  you also recorgni our tyoe of user also . 
declare module 'next-auth' {
  interface User {
    _id?: string;
    isVerified?: boolean;  
    isAcceptingMessages?: boolean;
    username?: string;
  }

  interface Session {
    user: {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username? : string ;
    } & DefaultSession['user']
  }
}

declare  module 'next-auth/jwt' {
    interface JWT { 
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}