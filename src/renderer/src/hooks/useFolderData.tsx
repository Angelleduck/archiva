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
  isLoading: boolean
  setSubfolders: React.Dispatch<React.SetStateAction<FolderType[]>>
  page: number
  handlePageUpdate: (page: number) => void
  totalPages: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export function useFolderData(folderId: string | undefined, text: string): useFolderDataType {
  const [folderDocuments, setFolderDocuments] = useState<FolderDocumentsType[]>([])
  const [folder, setFolder] = useState<FolderType>()
  const [subfolders, setSubfolders] = useState<FolderType[]>([])
  const [trigger, setTrigger] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    function sleep(): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, 150))
    }

    async function getFolderDocuments(folderId: string | undefined, text: string): Promise<void> {
      if (!folderId) return
      const [documentResult, folderResult, subfolders, allPages] = await Promise.all([
        window.api.folder.getDocuments(folderId),
        window.api.folder.get(folderId),
        window.api.folder.getSubfolders(folderId, page, text),
        window.api.folder.getSubfolderCount(Number(folderId), text),
        sleep()
      ])

      if (documentResult.success && folderResult.success && subfolders.success) {
        setFolderDocuments(documentResult.data)
        setFolder(folderResult.data)
        setSubfolders(subfolders.data)
      }

      if (allPages.success) {
        setTotalPages(Math.ceil(allPages.data / 11))
      }
      setIsLoading(false)
    }
    getFolderDocuments(folderId, text)
  }, [folderId, trigger, page])

  const handlePageUpdate = (selectedPage: number): void => {
    setPage(selectedPage)
  }

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1)
  }, [])

  return {
    folderDocuments,
    folder,
    subfolders,
    refetch,
    isLoading,
    setSubfolders,
    page,
    handlePageUpdate,
    totalPages,
    setPage
  }
}
