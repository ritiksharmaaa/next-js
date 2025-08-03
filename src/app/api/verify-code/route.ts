import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/singUpSchema";


const verifyCodeSchema = z.object({
    username: usernameValidation,
    code: z.string().min(4).max(8),
});

export async function POST(req: Request) {
    await dbConnected();

    try {
        const body = await req.json();
        const { username, code } = verifyCodeSchema.parse(body);

        const user = await userModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        if (!user.verifyCode) {
            return Response.json({
                success: false,
                message: "No verification code found for this user"
            }, { status: 400 });
        }

        // q: implement verifyCodeExpiry check and code is valid for 5 minutes ?
        if (user.verifyCodeExpiry && user.verifyCodeExpiry < new Date()) {
            return Response.json({
                success: false,
                message: "Verification code has expired sign up again"
            }, { status: 400 });
        }

        if (user.verifyCode !== code) {
            return Response.json({
                success: false,
                message: "Invalid code"
            }, { status: 400 });
        }

        user.isVerified = true;
        user.verifyCode = "";
        await user.save();

        return Response.json({
            success: true,
            message: "Code verified successfully"
        }, { status: 200 });

    } catch (error: unknown) {
        return Response.json({
            success: false,
            message: error instanceof Error ? error.message : "Invalid request"
        }, { status: 400 });
    }
}

