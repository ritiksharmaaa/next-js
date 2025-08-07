'use client'
import {useState , useEffect } from 'react'
import{useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod' 
import * as z  from 'zod'
import Link from 'next/link'
import { useDebounceCallback   } from "usehooks-ts"
import{useToast} from "@/hooks/use-toast"

import { useRouter } from 'next/navigation'
import { singUpSchema } from '@/schemas/singUpSchema'
import axios , {AxiosError} from 'axios' 
import {ApiResponse} from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form' 
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
 

const Page  = () => {
  const [username , setUsername] = useState('')
  const [usernameMessage , setUsernameMessage] = useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)
  const debounce = useDebounceCallback(setUsername , 300)  // here we are  callign our api not based on teh username we do it based on the debouncedUsername . 
  const {toast} = useToast() // this is help to create a notfcication message corner of the video
  const router  = useRouter() 
  // zod implemnetation fro use form 
  const form  = useForm<z.infer<typeof singUpSchema>>({resolver : zodResolver(singUpSchema) , 
    defaultValues : {
      username : ' ',
      email : '',
      password : ' '
    }, 

  })

  useEffect(()=>{
    const checkUsernameUniquenes  = async () =>{
      if(username) return; // if there is no username then we dont need to check it 
      setIsCheckingUsername(true)
      setUsernameMessage('checking username...')

      try {
        const res = await axios.get(`/api/check-username?username=${username}`) // this is our api that we created in the backend 
        const data = await res.data.message //  here please log and chekc whic type of query we are getting 
        if(data.isAvailable){
          setUsernameMessage('username is available')
        }else{
          setUsernameMessage('username is not available')
        }
      } catch (error) {
        const err  = error  as AxiosError<ApiResponse> 
        console.error('Error checking username:', err)
        setUsernameMessage('Error checking username')
      } finally {
        setIsCheckingUsername(false)
      }

    }
    checkUsernameUniquenes() ; 
  } , [username])

  // now we are makign a function  to handel the form submit . 

  const onSubmit = async (data : z.infer<typeof singUpSchema>) =>{
    setIsSubmitting(true)
    try {
      const res = await axios.post<ApiResponse>('/api/sign-up', data) // this is our api that we created in the backend here the data which we are dealing in json axios alredy handel all this in Json formate . 

      toast({
        title : 'Success' ,
        description : res.data.message || 'Sign up successful' 
      })

      // now what  we rediret the user to vefiy page wher ethey type there otp and  process go furthure on . 
      router.replace(`verify-code?username=${data.username}`) // this is our verify code page where we will verify the user .
      setIsSubmitting(false);

      
    } catch (error) {
      const err = error as AxiosError<ApiResponse>
      if(err.response?.data){
        toast({
          title : 'Error',
          description : err.response.data.message || 'Something went wrong', 
          variant : 'destructive' 
        })
      }else{
        toast({
          title : 'Error',
          description : 'Something went wrong'
        })
        setIsSubmitting(false)
      }
      
    }


  }
  
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 '>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
        <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight le:text-5xl mb-6">
          <p className="mb-4">Signup to start your anonmous adverture </p>

        </h1>
        </div>
        <Form {...form}>
          <form  className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
            control={form.control}
            name="username"
            render={({field})=>(
              <FormItem>
                <FormLabel>Username
                </FormLabel>
                <FormControl>
                  <Input placeholder='username' {...field} onChange={(e)=>{
                    field.onChange(e) // we are passign the input value to fiedl so i can process  the 
                    // here  we are passing e to actual field . becuase here we are doing manuall trafering of input . most of case we dont do this becuase it automatcilayy doen by reack hook form but we need to change soem value in username so based on that we send auto fetch username functionality thay why e are  doing this all . 
                    debounce(e.target.value)

                  }}/>

                </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />  } 
                <FormDescription>
                    <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500 ' : 'text-red-500'}`}></p>
                  This is your public display name {usernameMessage}
                </FormDescription>
                <FormMessage/>
              </FormItem>
  )}
            />
            <FormField 
            control={form.control}
            name="email"
            render={({field})=>(
              <FormItem>
                <FormLabel>Username
                </FormLabel>
                <FormControl>
                  <Input placeholder='email' {...field} />
                </FormControl>
               
                <FormMessage/>
              </FormItem>
  )}
            />
            <FormField 
            control={form.control}
            name="password"
            render={({field})=>(
              <FormItem>
                <FormLabel>password
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder='password' {...field} />
                </FormControl>
                              <FormMessage/>
              </FormItem>
  )}
            />
          <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? (<>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait
              </>) : ( 'Signup'
                
              )
            }
          </Button>

          </form>




        </Form>

        <div className="text-center mt-4">
          <p>Alredy a member?{" "} <Link href="/sign-in" className='text-blue-600 hover:text-blue-800 '> Sign In </Link></p>
        </div>





      </div>
    </div>

  )
}

export default Page