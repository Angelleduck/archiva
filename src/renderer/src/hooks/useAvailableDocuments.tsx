import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { FolderDocuments as FolderDocumentsType } from 'src/main/services/folder/folder.type'
import type { Document } from 'src/main/services/document/document.type'

interface useAvailableDocumentsType {
  documentsNotInFolder: Document[]
  setDocumentsNotInFolder: Dispatch<SetStateAction<Document[]>>
  isLoading: boolean
}

export function useAvailableDocuments(
  folderDocuments: FolderDocumentsType[]
): useAvailableDocumentsType {
  const [documentsNotInFolder, setDocumentsNotInFolder] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getAlldocument(): Promise<void> {
      const allDocuments = await window.api.document.getAll()

      if (allDocuments.success) {
        const result = allDocuments.data.filter(
          //laterrrr
          (doc) => !folderDocuments.find((fd) => fd.id === doc.id)
        )
        setDocumentsNotInFolder(result)
      }
      setIsLoading(false)
    }
    getAlldocument()
  }, [folderDocuments])

  return { documentsNotInFolder, setDocumentsNotInFolder, isLoading }
}
