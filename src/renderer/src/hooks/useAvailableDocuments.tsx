import { useEffect, useState } from 'react'
import type { Document } from 'src/main/services/document/document.type'

interface useAvailableDocumentsType {
  documentsNotInFolder: Document[]
  isLoading: boolean
}

export function useAvailableDocuments(folderId: number): useAvailableDocumentsType {
  const [documentsNotInFolder, setDocumentsNotInFolder] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getAlldocument(): Promise<void> {
      const result = await window.api.folder.getDocumentsNotInFolder(folderId)

      if (result.success) {
        console.log(result.data)
        setDocumentsNotInFolder(result.data)
      }
      setIsLoading(false)
    }
    getAlldocument()
  }, [folderId])

  return { documentsNotInFolder, isLoading }
}
