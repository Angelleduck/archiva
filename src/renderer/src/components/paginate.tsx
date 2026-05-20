import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination'

interface PaginateProps {
  page: number
  totalPages: number
  onPageUpdate: (selectedPage: number) => void
}

export function Paginate({
  page,
  totalPages,
  onPageUpdate
}: PaginateProps): React.JSX.Element | undefined {
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

  if (totalPages < 2) return

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem onClick={() => onPageUpdate(Math.max(1, page - 1))}>
          <PaginationPrevious text="Précédent" />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((p) => (
          <PaginationItem key={p} onClick={() => onPageUpdate(p)}>
            <PaginationLink isActive={p === page}>{p}</PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem onClick={() => onPageUpdate(Math.min(totalPages, page + 1))}>
          <PaginationNext text="Suivant" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
