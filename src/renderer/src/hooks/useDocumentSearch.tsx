import { debounce } from '@renderer/helper/utils'
import { useCallback, useMemo, useState } from 'react'
import type { FolderDocuments } from 'src/main/services/folder/folder.type'

interface useDocumentSearchType {
  filteredDocuments: FolderDocuments[]
  debouncedSetSearchTerm: (value: string) => void
}

export function useDoucmentSearch(folderDocuments: FolderDocuments[]): useDocumentSearchType {
  const [searchTerm, setSearchTerm] = useState('')

  // Memoize filtering for performance with large datasets
  const filteredDocuments = useMemo(() => {
    if (searchTerm.length < 2) {
      return folderDocuments
    }

    // return subfolders.filter((doc) => doc.name.toLowerCase().includes(searchTerm))
    return folderDocuments.filter((doc) => {
      return doc.filename.toLowerCase().includes(searchTerm)
    })
  }, [folderDocuments, searchTerm])

  // Debounce with useCallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 500),
    []
  )

  return { filteredDocuments, debouncedSetSearchTerm }
}
