import { ColumnDef } from '@tanstack/react-table'

import { MoreHorizontal } from 'lucide-react'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import { formatSize } from '@renderer/helper/utils'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type tableData = {
  id: string
  filename: string
  size: number
  created_at: Date
}

export const columns: ColumnDef<tableData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  // {
  //   accessorKey: 'status',
  //   header: 'Status'
  // },
  {
    accessorKey: 'filename',
    header: 'Nom',
    cell: ({ row }) => {
      return <div className="truncate max-w-[50ch]">{row.getValue('filename')}</div>
    }
  },
  {
    accessorKey: 'size',
    header: () => <div className="">Taille</div>,
    cell: ({ row }) => {
      const value = row.getValue('size') as number
      return <div className="">{formatSize(value)}</div>
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at')).toLocaleDateString()
      return <div>{date}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
