interface DocumentWithCount {
  id: string
  name: string
  color: string
  document_count: number
}

interface Folder {
  name: string
}
interface FolderDocuments {
  id: string
  filename: string
  path: string
  created_at: string
}
type CreateFolderType = { success: boolean; message?: string }
type GetFoldersType =
  | { success: true; data: DocumentWithCount[] }
  | { success: false; message?: string }
type GetFolderType =
  | { success: true; data: Folder | undefined }
  | { success: false; message?: string }

type GetFolderDocumentsType =
  | { success: true; data: FolderDocuments[] }
  | { success: false; message?: string }

type DeleteFolderType = { success: boolean; message?: string }

type AddDocumentType = { success: boolean; message?: string }
type RemoveDocumentType = { success: boolean; message?: string }
export type {
  CreateFolderType,
  GetFoldersType,
  DocumentWithCount,
  Folder,
  GetFolderType,
  FolderDocuments,
  GetFolderDocumentsType,
  DeleteFolderType,
  AddDocumentType,
  RemoveDocumentType
}
