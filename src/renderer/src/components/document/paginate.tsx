import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'

interface PaginateProps {
  page: number
  totalPages: number
  onPageUpdate: (selectedPage: number) => void
}

export function Paginate({ page, totalPages = 8, onPageUpdate }: PaginateProps): React.JSX.Element {
  const maxVisiblePages = 5

  // Determine the first page in the sliding window
  let startPage = Math.max(1, page - 2)
  let endPage = startPage + maxVisiblePages - 1

  // Adjust if endPage exceeds totalPages
  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  const pages: number[] = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem onClick={() => onPageUpdate(Math.max(1, page - 1))}>
          <PaginationPrevious />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((p) => (
          <PaginationItem key={p} onClick={() => onPageUpdate(p)}>
            <PaginationLink href="#" isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next button */}
        <PaginationItem
          // disabled={page === totalPages}
          onClick={() => onPageUpdate(Math.min(totalPages, page + 1))}
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
