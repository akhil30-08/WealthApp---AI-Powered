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
