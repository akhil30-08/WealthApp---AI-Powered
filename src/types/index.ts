import { Budget } from '@prisma/client';
import type { LucideIcon } from 'lucide-react';

export type IStatsData = {
   value: string;
   label: string;
};

export type IFeaturesData = {
   icon: LucideIcon;
   title: string;
   description: string;
};

export type IHowItWorksData = {
   icon: LucideIcon;
   title: string;
   description: string;
};

export type ITestimonialsData = {
   name: string;
   role: string;
   image: string;
   quote: string;
};

export type ISort = {
   order: 'asc' | 'desc';
   key: 'date' | 'category' | 'amount';
};

export type IBudgetData = {
   message: string;
   expenseDetails?: {
      _sum: {
         amount: string;
      };
   };
   budgetDetails: Budget | null;
};
