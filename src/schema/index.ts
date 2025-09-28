import { z } from 'zod';

export const accountSchema = z.object({
   name: z.string().min(1, { message: 'Please provide a name.' }),
   type: z.enum(['CURRENT', 'SAVINGS'], { message: 'Please select an account type' }),
   balance: z.string().min(1, { message: 'Initial balance is required' }),
   isDefault: z.boolean().default(false),
});

export const transactionSchema = z
   .object({
      type: z.enum(['INCOME', 'EXPENSE'], { message: 'Please provide transaction type' }),
      amount: z.string().min(1, { message: 'Amount is required' }),
      description: z.string().optional(),
      date: z.date({ required_error: 'Date is required' }),
      accountId: z.string().min(1, { message: 'Account ID is required' }),
      category: z.string().min(1, { message: 'Category is required' }),
      isRecurring: z.boolean().default(false),
      recurringInterval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
   })
   .superRefine((data, ctx) => {
      if (data.isRecurring && !data.recurringInterval) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Recurring Interval is required for recurring transactions',
            path: ['recurringInterval'],
         });
      }
   });
