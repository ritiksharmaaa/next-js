import dbConnected from "@/db_lib/dbConnect";
import userModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/utils/sendVerification";


// this post work when front end send email and all that we here handle it 
export async function POST(request: Request) {
    await dbConnected();
    try {
        const { username, email, password } = await request.json();
        console.log("username : ", username, "email : ", email, "password : ", password);
        
        // check user have in db or not or it is verfied or not 
        const userVerfiedByUsername = await userModel.findOne({ username, isVerfied: true });
        console.log("userVerfiedByUsername -------------: ", userVerfiedByUsername);
        
        if (userVerfiedByUsername) {
            return Response.json({
                success: false,
                message: "this username is already taken "
            }, {
                status: 409,
            });
        }
        
        const existingUserByEmail = await userModel.findOne({ email });
        const verfiedCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "this email is already taken "
                }, {
                    status: 409,
                });
            } else {
                // Update password and verification code for unverified user
                const hash_password = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hash_password;
                existingUserByEmail.verifyCode = verfiedCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();

               
                }
                 // Send verification email and return response here
                const res = await sendVerficationEmail(
                    email,
                    username,
                    verfiedCode
                );
                
                if (!res.success) {
                    return Response.json({
                        success: false,
                        message: res.message
                    }, {
                        status: 500,
                    });
                
                return Response.json({
                    success: true,
                    message: "we have sent a verification email to your email "
                });
            }
        } else {
            // if not we find username is not exit mail is not exixt it mean we have to create a user 
            const hash_password = await bcrypt.hash(password, 10); // hash the password 
            // not the the expiry token for otp 
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new userModel({
                username: username,
                email: email,
                password: hash_password,
                verifyCode: verfiedCode,  // this code is sent to user for verfication 
                verifyCodeExpiry: expiryDate,
                isVerfied: false,  // if user is verfied or not when he click on verfication link we change this to true
                isAcceptingMessage: true
            });

            await newUser.save();
            
            // here we send email because if inside return something it end
            const res = await sendVerficationEmail(
                email,
                username,
                verfiedCode
            );
            
            if (!res.success) {
                return Response.json({
                    success: false,
                    message: res.message // mean if email fail to send the mail it give some message to us to debug it . 
                }, {
                    status: 500,
                });
            }
            
            return Response.json({
                success: true,
                message: "we have sent a verification email to your email "
            });
        }
        
    } catch (error) {
        console.log(error, "error whiling singup user "); // this will show in frontend 
        // this response are for backend i think  
        return Response.json({
            success: false,
            message: "error while singup "
        }, {
            status: 500,
        });
    }
}
