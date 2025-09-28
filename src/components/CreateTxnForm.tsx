import { Category } from '@/lib/utils';
import { transactionSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Account } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { z } from 'zod';
import { Button } from './ui/button';
import DrawerComponent from './DrawerComponent';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Switch } from './ui/switch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useApiFetch } from '@/hooks/useApiFetch';
import { APIData } from './DashboardGrid';

type TransactionFormProps = {
   accountsData: {
      message: string;
      payload?: Account[] | null;
   };
   categories: Category[];
};

const CreateTxnForm = ({ accountsData, categories }: TransactionFormProps) => {
   const defaultAccountId = accountsData?.payload?.find((account) => account.isDefault === true)?.id ?? '';

   const router = useRouter();

   const { loading: submitLoading, fetchAPI } = useApiFetch<APIData>();

   const form = useForm<z.infer<typeof transactionSchema>>({
      resolver: zodResolver(transactionSchema),
      defaultValues: {
         amount: '',
         type: 'EXPENSE',
         description: '',
         isRecurring: false,
         date: new Date(),
         accountId: defaultAccountId,
      },
   });

   async function onSubmit(values: z.infer<typeof transactionSchema>) {
      try {
         const result = await fetchAPI('/api/transactions', {
            method: 'POST',
            data: values,
         });

         if (result?.payload) {
            toast.success('Transaction Created!');
            router.push(`/account/${form.getValues('accountId')}`);
            form.reset();
         }

         console.log({ result });
      } catch (error) {
         console.log(error);
         toast.error('Error creating transaction');
      }
   }

   const filteredCategories = categories.filter((category) => category.type === form.getValues('type'));

   return (
      <div>
         {/* AI SCANNER */}

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className='space-y-8 md:w-3/4'
            >
               <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Type</FormLabel>

                        <Select
                           defaultValue={field.value}
                           onValueChange={field.onChange}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder='Select Type' />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              <SelectItem value='EXPENSE'>Expense</SelectItem>
                              <SelectItem value='INCOME'>Income</SelectItem>
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className='flex flex-col md:flex-row justify-between'>
                  <FormField
                     control={form.control}
                     name='amount'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Amount</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder='10.00'
                                 type='number'
                                 className='placeholder:text-lg'
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
                     name='accountId'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Amount</FormLabel>

                           <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Select Account' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 {accountsData?.payload?.map((account) => {
                                    return (
                                       <SelectItem
                                          key={account?.id}
                                          value={account?.id}
                                       >
                                          <p>
                                             {account?.name}

                                             <span className='ml-3'>{account?.balance.toString()}</span>
                                          </p>
                                       </SelectItem>
                                    );
                                 })}

                                 <DrawerComponent fetchAccounts={() => {}}>
                                    <Button
                                       size={'sm'}
                                       variant={'outline'}
                                       className='w-full items-center select-none'
                                    >
                                       {' '}
                                       Create Account
                                    </Button>
                                 </DrawerComponent>
                              </SelectContent>
                           </Select>

                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Category</FormLabel>

                        <Select
                           defaultValue={field.value}
                           onValueChange={field.onChange}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {filteredCategories.map((category) => (
                                 <SelectItem
                                    key={category?.id}
                                    value={category?.id}
                                 >
                                    {category?.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Date</FormLabel>
                        <Popover>
                           <PopoverTrigger asChild>
                              <FormControl>
                                 <Button
                                    variant={'outline'}
                                    className='w-full flex justify-between'
                                 >
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                 </Button>
                              </FormControl>
                           </PopoverTrigger>
                           <PopoverContent
                              className='w-auto p-0'
                              align='start'
                           >
                              <Calendar
                                 mode='single'
                                 selected={field.value}
                                 onSelect={field.onChange}
                                 className='rounded-lg border'
                                 disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                 captionLayout='dropdown'
                              />
                           </PopoverContent>
                        </Popover>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Input
                              placeholder='Enter Description'
                              type='text'
                              className='placeholder:text-lg'
                              {...field}
                           />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name='isRecurring'
                  render={({ field }) => (
                     <FormItem className='flex items-center gap-5'>
                        <div className='space-y-2'>
                           <FormLabel>Recurring Transaction</FormLabel>
                           <FormDescription>Set Up a recurring schedule for this transaction.</FormDescription>
                        </div>

                        <FormControl>
                           <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='data-[state=checked]:bg-green-800/75'
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {form.getValues('isRecurring') === true && (
                  <FormField
                     control={form.control}
                     name='recurringInterval'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Recurring Interval</FormLabel>

                           <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder='Select Interval' />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 <SelectItem value='DAILY'>Daily</SelectItem>
                                 <SelectItem value='WEEKLY'>Weekly</SelectItem>
                                 <SelectItem value='MONTHLY'>Monthly</SelectItem>
                                 <SelectItem value='YEARLY'>Yearly</SelectItem>
                              </SelectContent>
                           </Select>

                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}

               <div className='flex items-center gap-4'>
                  <Button
                     type='button'
                     variant={'outline'}
                     className='w-full'
                     onClick={() => router.back()}
                  >
                     Cancel
                  </Button>
                  <Button
                     type='submit'
                     disabled={submitLoading}
                     className='w-full'
                  >
                     {submitLoading ? <Loader className='animate-spin h-4 w-4' /> : 'Submit'}
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
};

export default CreateTxnForm;
