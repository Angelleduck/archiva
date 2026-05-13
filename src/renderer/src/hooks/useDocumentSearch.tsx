import { debounce } from '@renderer/helper/utils'
import { useMemo, useState } from 'react'
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

    return folderDocuments.filter((doc) => {
      return doc.filename.toLowerCase().includes(searchTerm)
    })
  }, [folderDocuments, searchTerm])

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value)
      }, 500),
    []
  )

  return { filteredDocuments, debouncedSetSearchTerm }
}
