//  for message relate we have three manin task 
// 1. Accept message. give a toogel button which set is accprting messag eor not  
// show the all the message which user sent to his an  her via checking who is currently loged in here in next js we can use getSession to find the user becuse we use both seeesion and jwt and session stored in bakend . so we didn wan to get the logendin user from the front end side we get this bfrom backend side . here api is like self suffice . just you call it we will see who is logged in and we will return the data based on that .

import { getServerSession  } from "next-auth";
import { authOption  } from "../auth/[...nextauth]/options";
import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";
import {User} from "next-auth"

export async function POST(request: Request) {
    await dbConnected(); 
    const session = await getServerSession(authOption);
    const user: User   = session?.user  as User // here we use the importe user from next auth for type . 
    if(!session || !session.user) {
        return Response.json({ success : false , message : "user not Authenticated ", } , { status: 401 });
    }
    const userId  = user._id; // here we get the id from the session user .
    const { AcceptingMessage} = await request.json(); 
    try {
        // Find the user by ID and update the acceptMessages field
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage : AcceptingMessage },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return Response.json({ success: false, message: "failed to  update user status to accept message " }, { status: 404 });
        }

        return Response.json({ success: true, message: "Message acceptance updated successfully", user: updatedUser },{status : 200 } );
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ success : false  , message : error.message  }, { status: 400 });
        }
        return Response.json({ error: "Unknown error occurred" }, { status: 400 });
    }




}


export async function GET(request: Request) { 
    await dbConnected();
    const session = await getServerSession(authOption);
    if (!session || !session.user) {
        return Response.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }
    const user: User = session.user as User;
    const userId = user._id;

    try {
        const dbUser = await userModel.findById(userId).select("isAcceptingMessage");
        if (!dbUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ success: true, isAcceptingMessage: dbUser.isAcceptingMessage }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ success: false, message: error.message }, { status: 400 });
        }
        return Response.json({ error: "Unknown error occurred" }, { status: 400 });
    }
}