import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationProps = {
   currentPage: number;
   totalPages: number;
   setCurrentPage: (page: number) => void;
};

const PaginationComponent = ({ currentPage, totalPages, setCurrentPage }: PaginationProps) => {
   /**
    * Determines which page numbers to display in the pagination
    * Always shows first, last, current, and adjacent pages
    */
   const getDisplayedPages = () => {
      const pages = new Set<number>();

      // Always include first and last pages
      pages.add(1);
      if (totalPages > 1) pages.add(totalPages);

      // Include current page and adjacent pages
      if (currentPage > 1) pages.add(currentPage - 1);
      pages.add(currentPage);
      if (currentPage < totalPages) pages.add(currentPage + 1);

      // Convert to sorted array
      return Array.from(pages).sort((a, b) => a - b);
   };

   /**
    * Renders the pagination items with proper gaps and ellipsis
    */
   const renderPageItems = () => {
      const displayedPages = getDisplayedPages();
      const items: React.ReactNode[] = [];

      displayedPages.forEach((page, index) => {
         // Add ellipsis if there's a gap between this and previous page
         const prevPage = displayedPages[index - 1];
         if (index > 0 && page - prevPage > 1) {
            items.push(
               <PaginationItem key={`ellipsis-${prevPage}`}>
                  <PaginationEllipsis />
               </PaginationItem>
            );
         }

         // Add the page number button
         items.push(
            <PaginationItem key={page}>
               <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  href={'#'}
                  isActive={page === currentPage}
               >
                  {page}
               </PaginationLink>
            </PaginationItem>
         );
      });

      return items;
   };

   return (
      <Pagination>
         <PaginationContent>
            {/* Previous Page Button - Disabled on first page */}
            <PaginationItem>
               <PaginationPrevious
                  onClick={() => {
                     if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                     }
                  }}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : undefined}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
                  href={'#'}
               />
            </PaginationItem>

            {/* Rendered Page Numbers */}
            {renderPageItems()}

            {/* Next Page Button - Disabled on last page */}
            <PaginationItem>
               <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : undefined}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                  href={'#'}
               />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   );
};

export default PaginationComponent;
