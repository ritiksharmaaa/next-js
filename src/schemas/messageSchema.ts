import  {z} from "zod"


export const acceptMessageSchema = z.object({
    content : z.string().min(10 , "content must we at least 10 and max 300 characters").max(300) ,

}
)