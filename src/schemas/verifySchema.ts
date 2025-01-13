import  { z} from "zod"


export const verfiySchema = z.object({
    code : z.string().length(6 , "verication mustbe 6 characters")
}
)