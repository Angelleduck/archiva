import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { FolderDocuments as FolderDocumentsType } from 'src/main/services/folder/folder.type'
import type { Document } from 'src/main/services/document/document.type'

interface useAvailableDocumentsType {
  documentsNotInFolder: Document[]
  setDocumentsNotInFolder: Dispatch<SetStateAction<Document[]>>
}

export function useAvailableDocuments(
  folderDocuments: FolderDocumentsType[]
): useAvailableDocumentsType {
  const [documentsNotInFolder, setDocumentsNotInFolder] = useState<Document[]>([])

  useEffect(() => {
    console.log('check fetcheee')
    async function getAlldocument(): Promise<void> {
      const allDocuments = await window.api.document.getAll()

      if (allDocuments.success) {
        const result = allDocuments.data.filter(
          (doc) => !folderDocuments.find((fd) => fd.id === doc.id)
        )
        setDocumentsNotInFolder(result)
      }
    }
    getAlldocument()
  }, [folderDocuments])

  return { documentsNotInFolder, setDocumentsNotInFolder }
}
