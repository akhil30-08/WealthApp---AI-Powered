'use client';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { accountSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useApiFetch } from '@/hooks/useApiFetch';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { APIData } from './DashboardGrid';

const DrawerComponent = ({ children, fetchAccounts }: { children: React.ReactNode; fetchAccounts: () => void }) => {
   const [open, setOpen] = useState(false);

   const { error, loading: submitLoading, fetchAPI } = useApiFetch<APIData>();

   const form = useForm<z.infer<typeof accountSchema>>({
      resolver: zodResolver(accountSchema),
      defaultValues: {
         name: '',
         type: 'CURRENT',
         isDefault: false,
         balance: '',
      },
   });

   async function onSubmit(values: z.infer<typeof accountSchema>) {
      const result = await fetchAPI('/api/account', {
         method: 'POST',
         data: values,
      });

      console.log(result);

      if (result?.payload) {
         fetchAccounts();
         toast.success('Account Created!');
         form.reset();
      }

      if (error) return;
      setOpen(() => false);
   }

   return (
      <div>
         <Drawer
            open={open}
            onOpenChange={setOpen}
         >
            <DrawerTrigger
               asChild
               className='w-full'
            >
               {children}
            </DrawerTrigger>
            <DrawerContent className='space-x-2 space-y-3 py-2'>
               <DrawerTitle>Create new Account</DrawerTitle>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className='space-y-8 md:w-3/4'
                  >
                     <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder='shadcn'
                                    {...field}
                                 />
                              </FormControl>

                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='balance'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Balance</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder='15.50'
                                    type='number'
                                    step={0.01}
                                    {...field}
                                 />
                              </FormControl>

                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Account Type</FormLabel>

                              <Select
                                 defaultValue={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder='Select Account Type' />
                                    </SelectTrigger>
                                 </FormControl>

                                 <SelectContent>
                                    <SelectItem value='CURRENT'>Current</SelectItem>
                                    <SelectItem value='SAVINGS'>Savings</SelectItem>
                                 </SelectContent>
                              </Select>

                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name='isDefault'
                        render={({ field }) => (
                           <FormItem className='flex items-center gap-5'>
                              <div className='space-y-2'>
                                 <FormLabel>Set as Default</FormLabel>
                                 <FormDescription>This account will be selected by default for transactions.</FormDescription>
                              </div>

                              <FormControl>
                                 <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className='flex items-center gap-4'>
                        <Button
                           type='button'
                           variant={'outline'}
                           onClick={() => setOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button
                           type='submit'
                           disabled={submitLoading}
                           className='min-w-24'
                        >
                           {submitLoading ? <Loader className='animate-spin h-4 w-4' /> : 'Submit'}
                        </Button>
                     </div>
                  </form>
               </Form>
            </DrawerContent>
         </Drawer>
      </div>
   );
};

export default DrawerComponent;
