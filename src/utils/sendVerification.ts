// for sending mail notifications called 
// import mail sending function from where you made it 
import { resend } from "@/db_lib/resend";
import VerificationEmail  from "../../emails/verficationEmail";
import { ApiResponse } from "../types/ApiResponse";


export async function sendVerficationEmail(email : string , username : string , verifycode : string ) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from : "mail.resend.com",
            to : email  , 
            subject : "Email Verification code ",
            react : VerificationEmail({username  , otp : verifycode})
        })
        return {success: true, message: "verification mail sent successfully"}

        
    } catch (error) {
        console.error(error , "Error while sending mail notification")
        return {success : false , message : "failed to send verfication mail"}
        
    }

    
}