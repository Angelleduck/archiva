interface AddFileProps {
  filename: string
  originalPath: string
}

interface Document {
  id: string
  filename: string
  path: string
  size: number
  created_at: string
}
interface SelectedFiles {
  filename: string
  path: string
}

type AddFileType = { success: boolean; message?: string }
type GetAllType = { success: true; data: Document[] } | { success: false; message?: string }
type GetRecentType = { success: true; data: Document[] } | { success: false; message?: string }
type DeleteType = { success: boolean; message?: string }
type OpenDocumentType = { success: boolean; message?: string }
type SelectFile = { success: true; data: SelectedFiles[] } | { success: false; message?: string }

export type {
  AddFileProps,
  AddFileType,
  GetAllType,
  GetRecentType,
  DeleteType,
  Document,
  OpenDocumentType,
  SelectFile,
  SelectedFiles
}
