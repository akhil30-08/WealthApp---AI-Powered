import { z } from 'zod';

export const accountSchema = z.object({
   name: z.string().min(1, { message: 'Please provide a name.' }),
   type: z.enum(['CURRENT', 'SAVINGS'], { message: 'Please select an account type' }),
   balance: z.string().min(1, { message: 'Initial balance is required' }),
   isDefault: z.boolean().default(false),
});
