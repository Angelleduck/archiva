import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  DeleteType,
  GetAllType,
  GetRecentType,
  OpenDocumentType,
  SelectFile
} from '../main/services/document/document.type'
import type {
  AddDocumentType,
  CreateFolderType,
  DeleteFolderType,
  GetFolderDocumentsType,
  GetFoldersType,
  GetFolderType,
  RemoveDocumentType
} from '../main/services/folder/folder.type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      document: {
        selectFile: () => Promise<SelectFile>
        importFile: (documents: Record<string, any>[]) => Promise<void>
        getAll: () => Promise<GetAllType>
        getRecent: () => Promise<GetRecentType>
        open: (path: string) => Promise<OpenDocumentType>
        delete: (id: string) => Promise<DeleteType>
      }
      folder: {
        getRootFolders: () => Promise<GetFoldersType>
        get: (id: string) => Promise<GetFolderType>
        getSubfolders: (id: string) => Promise<GetFoldersType>
        getDocuments: (id: string) => Promise<GetFolderDocumentsType>
        create: (name: string) => Promise<CreateFolderType>
        createSubfolder: (parentId: number, name: string) => Promise<any>
        delete: (id: number) => Promise<DeleteFolderType>
        addDocument: (folderId: stringId, documentId: string) => Promise<AddDocumentType>
        removeDocument: (folderId: stringId, documentId: string) => Promise<RemoveDocumentType>
      }
    }
  }
}
