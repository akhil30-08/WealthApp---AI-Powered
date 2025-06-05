'use-client';

import { Transaction } from '@prisma/client';
import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp, Clock, ListFilter, MoreHorizontal, Search, X } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ISort } from '@/types';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { useApiFetch } from '@/hooks/useApiFetch';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import PaginationComponent from './PaginationComponent';

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => {
   const [selectTxn, setSelectTxn] = useState<string[]>([]);
   const [sortType, setSortType] = useState<ISort>({
      key: 'date',
      order: 'desc',
   });
   const [searchTxn, setSearchTxn] = useState('');
   const [searchType, setSearchType] = useState('');
   const [searchRecurring, setSearchRecurring] = useState('');

   const { fetchAPI } = useApiFetch();

   //get the debounced value
   const debouncedSearch = useDebounce(searchTxn, 1500);

   const filteredAndSortedTxns = useMemo(() => {
      let result = [...transactions];

      //search by transaction description
      if (debouncedSearch) {
         result = result.filter((txn) => txn.description?.toLowerCase().includes(debouncedSearch.toLowerCase()));
      }

      //search by transaction type
      if (searchType) {
         result = result.filter((txn) => txn.type === searchType);
      }

      if (searchRecurring) {
         result = result.filter((txn) => {
            if (searchRecurring === 'recurring') {
               return txn.isRecurring === true;
            } else {
               return txn.isRecurring === false;
            }
         });
      }

      //now sorting
      result.sort((a, b) => {
         let comparison: number = 0;

         if (sortType.key === 'date') {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
         } else if (sortType.key === 'category') {
            comparison = a.category.localeCompare(b.category);
         } else {
            comparison = Number(a.amount) - Number(b.amount);
         }

         return sortType.order === 'asc' ? comparison : -comparison;
      });

      return result;
   }, [transactions, debouncedSearch, searchType, searchRecurring, sortType]);

   const handleSelectTxn = (txnId: string) => {
      return selectTxn.includes(txnId) ? setSelectTxn(selectTxn.filter((id) => id !== txnId)) : setSelectTxn([...selectTxn, txnId]);
   };

   const handleSelectAllTxns = () => {
      return selectTxn.length === transactions.length ? setSelectTxn([]) : setSelectTxn(transactions.map((txn) => txn.id));
   };

   const handleSort = (key: ISort['key']) => {
      return setSortType((prev) => ({
         ...prev,
         key,
         order: prev.key === key ? (prev.order === 'asc' ? 'desc' : 'asc') : 'desc',
      }));
   };

   const handleDeleteTransactions = async (deleteIds: string[]) => {
      return await fetchAPI('/api/transactions', {
         method: 'DELETE',
         data: {
            transactionId: deleteIds,
         },
      });
   };

   //pagination logic here
   const pageSize = 10; // Number of transactions per page
   const totalPages = Math.ceil(filteredAndSortedTxns.length / pageSize);

   const [currentPage, setCurrentPage] = useState<number>(1);

   const startIndex = (currentPage - 1) * pageSize;
   const endIndex = startIndex + pageSize;

   const paginatedTxns = filteredAndSortedTxns.slice(startIndex, endIndex);

   return (
      <section>
         {/* filter section */}
         <div className='flex flex-col md:flex-row mb-4 w-full gap-3'>
            <div>
               <Search className='absolute ml-3 mt-2 w-5 h-5 opacity-75' />
               <Input
                  type='search'
                  placeholder='Search Transactions...'
                  className='pl-10'
                  value={searchTxn}
                  onChange={(e) => setSearchTxn(e.target.value)}
               />
            </div>
            <div className='flex gap-2'>
               <Select
                  value={searchType}
                  onValueChange={setSearchType}
               >
                  <SelectTrigger className='w-auto'>
                     <SelectValue placeholder='All Types' />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value='INCOME'>Income</SelectItem>
                     <SelectItem value='EXPENSE'>Expense</SelectItem>
                  </SelectContent>
               </Select>

               <Select
                  value={searchRecurring}
                  onValueChange={setSearchRecurring}
               >
                  <SelectTrigger className='w-auto'>
                     <SelectValue
                        className='text-base'
                        placeholder='All Transactions'
                     />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value='recurring'>Recurring Only</SelectItem>
                     <SelectItem value='non-recurring'>Non-Recurring Only</SelectItem>
                  </SelectContent>
               </Select>

               {selectTxn.length > 0 && (
                  <Dialog>
                     <DialogTrigger asChild>
                        <Button variant={'destructive'}>Delete</Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Are you absolutely sure?</DialogTitle>
                           <DialogDescription>
                              This action cannot be undone. This will permanently delete your selected {selectTxn.length} transactions.
                           </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className='sm:justify-start'>
                           <DialogClose asChild>
                              <Button
                                 variant={'destructive'}
                                 onClick={() => handleDeleteTransactions(selectTxn)}
                              >
                                 Delete ({selectTxn.length})
                              </Button>
                           </DialogClose>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               )}

               {(searchType || searchRecurring) && (
                  <Button
                     size={'icon'}
                     variant={'outline'}
                     onClick={() => {
                        setSearchType('');
                        setSearchRecurring('');
                     }}
                  >
                     <X className='h-4 w-4' />
                  </Button>
               )}
            </div>
         </div>
         {/* table section */}
         <Table>
            <TableCaption>A list of your transactions</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead className='w-11'>
                     <Checkbox
                        onCheckedChange={handleSelectAllTxns}
                        checked={transactions.length > 0 && transactions.length === selectTxn.length}
                     />
                  </TableHead>
                  <TableHead
                     className='cursor-pointer'
                     onClick={() => handleSort('date')}
                  >
                     <div className='flex gap-1 items-center'>
                        Date
                        {sortType['key'] === 'date' ? (
                           sortType.order === 'asc' ? (
                              <ChevronUp className='h-4 w-4' />
                           ) : (
                              <ChevronDown className='h-4 w-4' />
                           )
                        ) : (
                           <ListFilter className='h-4 w-4' />
                        )}
                     </div>
                  </TableHead>
                  <TableHead className='max-w-xs'>Description</TableHead>
                  <TableHead
                     className='cursor-pointer'
                     onClick={() => handleSort('category')}
                  >
                     <div className='flex gap-1 items-center'>
                        Category
                        {sortType['key'] === 'category' ? (
                           sortType.order === 'asc' ? (
                              <ChevronUp className='h-4 w-4' />
                           ) : (
                              <ChevronDown className='h-4 w-4' />
                           )
                        ) : (
                           <ListFilter className='h-4 w-4' />
                        )}
                     </div>
                  </TableHead>
                  <TableHead
                     className='text-right cursor-pointer'
                     onClick={() => handleSort('amount')}
                  >
                     {' '}
                     <div className='flex gap-1 items-center'>
                        Amount
                        {sortType['key'] === 'amount' ? (
                           sortType.order === 'asc' ? (
                              <ChevronUp className='h-4 w-4' />
                           ) : (
                              <ChevronDown className='h-4 w-4' />
                           )
                        ) : (
                           <ListFilter className='h-4 w-4' />
                        )}
                     </div>
                  </TableHead>
                  <TableHead className='text-left cursor-pointer'>Recurring</TableHead>
                  <TableHead className='w-[20px]'></TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {transactions?.length === 0 && (
                  <TableRow>
                     <TableCell
                        colSpan={7}
                        className='text-center text-muted-foreground'
                     >
                        No transaction Found
                     </TableCell>
                  </TableRow>
               )}

               {paginatedTxns?.map((transaction) => {
                  return (
                     <TableRow key={transaction.id}>
                        <TableCell>
                           <Checkbox
                              checked={selectTxn.includes(transaction.id)}
                              onCheckedChange={() => handleSelectTxn(transaction.id)}
                           />
                        </TableCell>
                        <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                        <TableCell className={`truncate max-w-xs`}>
                           <TooltipProvider>
                              <Tooltip>
                                 <TooltipTrigger asChild>
                                    <div className='truncate'>{transaction.description}</div>
                                 </TooltipTrigger>

                                 <TooltipContent>
                                    <p>{transaction.description}</p>
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className={`text-right ${transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'} font-medium`}>
                           {transaction.type === 'EXPENSE' ? '-' : '+'}${String(transaction.amount)}
                        </TableCell>
                        <TableCell>
                           {transaction.isRecurring ? (
                              <TooltipProvider>
                                 <Tooltip>
                                    <TooltipTrigger>
                                       <Badge
                                          variant={'outline'}
                                          className='bg-purple-100 text-purple-700 hover:bg-purple-300'
                                       >
                                          <Clock className='h-3 w-3 mr-2' />
                                          {transaction.recurringInterval}
                                       </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                       <p>Next Date:</p>
                                       {transaction?.nextRecurringDate && <p>{format(new Date(transaction?.nextRecurringDate), 'PP')}</p>}
                                    </TooltipContent>
                                 </Tooltip>
                              </TooltipProvider>
                           ) : (
                              <Badge variant={'outline'}>
                                 <Clock className='h-3 w-3 mr-2' />
                                 One-Time
                              </Badge>
                           )}
                        </TableCell>

                        <TableCell>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button
                                    variant={'ghost'}
                                    className='h-8 w-8 p-0'
                                 >
                                    <MoreHorizontal className='h-4 w-4' />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                 <DropdownMenuLabel>Edit</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 <DropdownMenuItem className='text-destructive'>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>
         {/* pagination section */}
         <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
         />
      </section>
   );
};

export default TransactionTable;
