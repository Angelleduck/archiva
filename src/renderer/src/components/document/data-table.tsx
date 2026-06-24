import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import type { Document } from 'src/main/services/document/document.type'
import toast from 'react-hot-toast'

interface DataTableProps {
  columns: ColumnDef<Document>[]
  data: Document[]
  onTrigger: () => void
}

export function DataTable({ columns, data, onTrigger }: DataTableProps): React.JSX.Element {
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState<Document[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      columnFilters
    }
  })

  useEffect(() => {
    const rows = table.getSelectedRowModel().rows.map((row) => row.original)
    setSelectedRows(rows)
  }, [rowSelection, table])

  const handleDeleteFile = async (): Promise<void> => {
    const result = await window.api.document.delete(selectedRows)
    if (!result.success && result.message) {
      toast.error(result.message)
      // return later
    } else if (result.success && result.message) {
      toast.success(result.message)
    }
    onTrigger()
    setRowSelection({})
  }

  return (
    <div>
      <div className="flex justify-end my-4 min-h-9">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            onClick={handleDeleteFile}
            size="lg"
            className="bg-destructive/80 hover:bg-destructive"
          >
            Supprimer
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  )
}
