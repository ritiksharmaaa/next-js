import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verfiySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
    const router = useRouter();
    const parms = useParams<{ username: string }>();
    const { toast } = useToast();

    // forms 

    // zod implemnetation fro use form 
    const form = useForm<z.infer<typeof verfiySchema>>({
        resolver: zodResolver(verfiySchema),
        defaultValues: {
            code: " "
        },

    })

    const onSubmit = async (data: z.infer<typeof verfiySchema>) => {
        try {
            const res = await axios.post(`api/verify-code`, {
                username: parms.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: res.data.message


            })

            // now we redirect to user 

            router.replace("sign-in")



        } catch (error) {
            const err = error as AxiosError<ApiResponse>
            console.error('Error checking username:', err)
            toast({
                title: "Error while please try again after some time ",
                description: " ",
                variant: "destructive"
            })


        }

    }






    return (
        <div className="flex justifiy-center items-center min-h-screen bg-gray-100 after:">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
                <div className="text center">
                    <h1 className="text-4xl font-extabold tracking lg:text-5xl mb-6">
                        verify your  Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent your email
                    </p>
                </div>
                <Form {...form}>
                    <form  className="space-y-8" onSubmit={form.handleSubmit(onSubmit)

                    }>
                        <FormField
                        control={form.control}
                        name="code"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel> Verification Code </FormLabel>
                                <FormControl>
                                  <Input placeholder='Code' {...field} />
                                </FormControl>
                                <FormDescription >

                                </FormDescription >
                                <FormMessage />
                            </FormItem>
                        )}
  />
                            <Button type="submit">Submit</Button>
                    </form>
                </Form>








            </div>

        </div>
    )
}

export default VerifyAccount