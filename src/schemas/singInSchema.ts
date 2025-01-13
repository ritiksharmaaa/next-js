import  { z} from "zod"


export const singInSchema = z.object({
    email  : z.string() ,// you can also say identfeir instedof email in production ,
    password : z.string().min(8), // password length should be at least 8 characters
}
)