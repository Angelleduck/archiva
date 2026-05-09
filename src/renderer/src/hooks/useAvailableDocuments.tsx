import { useCallback, useEffect, useState } from 'react'
import type { Document } from 'src/main/services/document/document.type'

interface useAvailableDocumentsType {
  documentsNotInFolder: Document[]
  isLoading: boolean
  handlePageUpdate: (page: number) => void
  page: number
  totalPages: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  refetch: () => void
}

export function useAvailableDocuments(
  folderId: number,
  searchTerm: string
): useAvailableDocumentsType {
  const [documentsNotInFolder, setDocumentsNotInFolder] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    async function getAlldocument(): Promise<void> {
      console.log('trigger')
      const [result, allPages] = await Promise.all([
        window.api.folder.getDocumentsNotInFolder(folderId, page, searchTerm),
        window.api.folder.countDocumentNotInFolder(folderId, searchTerm)
      ])

      if (result.success) {
        setDocumentsNotInFolder(result.data)
      }
      if (allPages.success) {
        setTotalPages(Math.ceil(allPages.data / 20))
      }
      setIsLoading(false)
    }
    getAlldocument()
  }, [folderId, page, trigger])

  const handlePageUpdate = (selectedPage: number): void => {
    setPage(selectedPage)
  }

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1)
  }, [])

  return { documentsNotInFolder, isLoading, handlePageUpdate, page, totalPages, setPage, refetch }
}
