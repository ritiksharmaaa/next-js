import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/singUpSchema";
import {z} from "zod"; 


const  userQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request : Request){
    await dbConnected(); 
    try {
        const { searchParams } = new URL(request.url);

        //  here when every you pass sothing you need to pass a object not direclty variable in zod 

        // my code also work if i direlty pass searchparam.get.username it my way an dit work also . 

        const usernameParm = { username : searchParams.get("username");}

        const parsedData = userQuerySchema.safeParse(usernameParm);

        if (!parsedData.success) {
            return Response.json({
                success: false,
                message: parsedData.error.errors[0].message,
            }, { status: 400 });
        }

        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already exists",
            }, { status: 409 });
        }

        return Response.json({
            success: true,
            message: "Username is available",
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error  while checking username ", error);
        return Response.json({
            success : false , 
            message: "Error while checking username",
        }, {status : 500 });
    }

}