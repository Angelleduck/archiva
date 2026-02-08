import { useCallback, useEffect, useState } from 'react'
import type {
  FolderDocuments as FolderDocumentsType,
  Folder as FolderType
} from 'src/main/services/folder/folder.type'

interface useFolderDataType {
  folderDocuments: FolderDocumentsType[]
  folder: FolderType | undefined
  subfolders: FolderType[]
  refetch: () => void
}

export function useFolderData(folderId: string | undefined): useFolderDataType {
  const [folderDocuments, setFolderDocuments] = useState<FolderDocumentsType[]>([])
  const [folder, setFolder] = useState<FolderType>()
  const [subfolders, setSubfolders] = useState<FolderType[]>([])
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    async function getFolderDocuments(folderId: string | undefined): Promise<void> {
      if (!folderId) return
      const [documentResult, folderResult, subfolders] = await Promise.all([
        window.api.folder.getDocuments(folderId),
        window.api.folder.get(folderId),
        window.api.folder.getSubfolders(folderId)
      ])

      if (documentResult.success && folderResult.success && subfolders.success) {
        setFolderDocuments(documentResult.data)
        setFolder(folderResult.data)
        setSubfolders(subfolders.data)
      }
    }
    getFolderDocuments(folderId)
  }, [folderId, trigger])

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1)
  }, [])

  return { folderDocuments, folder, subfolders, refetch }
}
