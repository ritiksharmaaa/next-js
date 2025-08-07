import { z } from "zod";

export const  usernameValidation = z.string()
.min(2 , "username must be at least 2 characters")
.max(20 , "must be at least 20 characters")
.regex(/^[a-zA-Z0-9_]*$/ , "username must be alphanumeric") // we nedd username must we abcg asw ell 23123



export const singUpSchema = z.object({
    username : usernameValidation, // or you can directly write upper code inside it but it clutter 
    email : z.string().email({message : "invalid"}), // or you can directly write upper code // emal return if not 
    password : z.string().min(8 , {message : "must be at least 8 characters"}),
    // confirmPassword : z.string().ref('password') // password confirmation

})

