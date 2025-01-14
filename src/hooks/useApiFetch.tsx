import { useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export const useApiFetch = <T,>() => {
   const [data, setData] = useState<T | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<Error | null | AxiosError>(null);

   const fetchAPI = async (url: string, options?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
         const response = await axios(url, options);
         setData(response.data);
         return response.data;
      } catch (error) {
         if (axios.isAxiosError(error)) {
            setError(error);
            toast.error(error?.response?.data?.message || 'An API error occurred');
         } else if (error instanceof Error) {
            setError(error);
            toast.error(error.message || 'An unexpected error occurred');
         }
      } finally {
         setLoading(false);
      }
   };

   return { data, loading, error, fetchAPI };
};
