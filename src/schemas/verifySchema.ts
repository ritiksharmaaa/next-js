import  { z} from "zod"


export const verfiySchema = z.object({
    code : z.string().length(6 , "verication must be 6 characters")
}
)