import { debounce } from '@renderer/helper/utils'
import { useCallback, useMemo, useState } from 'react'
import type { Folder as FolderType } from 'src/main/services/folder/folder.type'

interface useFolderSearchType {
  filteredSubfolders: FolderType[]
  debouncedSetSearchTerm: (value: string) => void
}

export function useFolderSearch(subfolders: FolderType[]): useFolderSearchType {
  const [searchTerm, setSearchTerm] = useState('')

  // Memoize filtering for performance with large datasets
  const filteredSubfolders = useMemo(() => {
    if (searchTerm.length < 2) {
      return subfolders
    }

    return subfolders.filter((doc) => doc.name.toLowerCase().includes(searchTerm))
  }, [subfolders, searchTerm])

  // Debounce with useCallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 500),
    []
  )

  return { filteredSubfolders, debouncedSetSearchTerm }
}
