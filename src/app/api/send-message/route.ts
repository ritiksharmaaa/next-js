import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";
import { Message } from "@/model/User.model";

// import {Message} from "@/model/User.model"


export async function POST(request: Request) { 
    await dbConnected(); 
    //  notnned to login because it a  anon message functionaity 
    const { username , content  } = await request.json();

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return  Response.json( { success : false , message : "user not found "}, { status: 404 });
        }
        // check user accept message or not
        if (!user.isAcceptingMessage) {     
            return Response.json({ success: false, message: "User does not accept messages" }, { status: 403 });
        }

        const newMessage = { 
            content , createdAt: new Date(),
        }
        user.messages.push(newMessage as Message); // here we get error because we have to pass the type of because we say that the content is came is exactly same as Message interface in ts .
        await user.save();  
        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });


         

        
    } catch (error : unknown) {
        return Response.json({ success: false, message: `An error occurred while sending the message ${error}` }, { status: 500 });
        
    }
}