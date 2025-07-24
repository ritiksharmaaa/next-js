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

        const usernameParm = { username : searchParams.get("username")}

        const parsedData = userQuerySchema.safeParse(usernameParm);
        // or we get resutl from zod . must log and watch . 

        if (!parsedData.success) {
            const usernameError = parsedData.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(',') : "invalid query parmeter "
            }, { status: 500 });
        }
        const {username } = parsedData.data // here we are getting valid dat after zod validate . 

        const existingUserVerfied = await userModel.findOne({ username  , isverified: true });

        if (existingUserVerfied) {
            return Response.json({
                success: false,
                message: "Username is already taken",
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