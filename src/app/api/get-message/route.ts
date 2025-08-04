import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request: Request) {
    await dbConnected(); 
    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
    // const uid = user._id;  //note in ts config what we do we make id to a string  so this can creat migth proble in mogodb aggragration  so insted use id like that we have to in differnt manner 
     const user_id = new mongoose.Types.ObjectId(user._id)


    try {

        const user  = await userModel.aggregate([
            // Match the user by email
            { $match: { _id : user_id } },
            // Lookup messages from messages collection
            {$unwind: "$messages"}, // Unwind messages array to process each message individually
            {$sort : { "messages.createdAt": -1 } }, // Sort messages by createdAt in descending order
            
            {
                $group : {
                    _id : "$_id", // Group by user ID. 
                    messages: { $push: "$messages" } // Push messages into an array
                
                }
            }
        ]);

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found or no messages available"
            }, { status: 404 });
        }


        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 });
        
    } catch (error: unknown) {
        console.error("Error in GET /api/get-message:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}