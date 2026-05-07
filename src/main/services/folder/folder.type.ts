interface DocumentWithCount {
  id: string
  name: string
}

interface Folder {
  id: number
  name: string
  created_at: string
}
interface FolderDocuments {
  id: number
  filename: string
  path: string
  created_at: string
  size: number
}
type CreateFolderType = { success: boolean; message?: string }
type CreateSubfolderType = { success: boolean }
type GetFoldersType = { success: true; data: Folder[] } | { success: false; message?: string }
type GetFolderType =
  | { success: true; data: Folder | undefined }
  | { success: false; message?: string }

type GetFolderDocumentsType =
  | { success: true; data: FolderDocuments[] }
  | { success: false; message?: string }
type GetDocumentsNotInFolderType =
  | { success: true; data: FolderDocuments[] }
  | { success: false; message?: string }

type DeleteFolderType = { success: boolean; message?: string }

type AddDocumentType = { success: boolean; message?: string }
type RemoveDocumentType = { success: boolean; message?: string }
type editFolderTitleType = { success: boolean; message?: string }
type getFolderCountType = { success: boolean; data: number } | { success: false }
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
  RemoveDocumentType,
  CreateSubfolderType,
  editFolderTitleType,
  getFolderCountType,
  GetDocumentsNotInFolderType
}
