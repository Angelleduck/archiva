import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  DeleteType,
  GetAllType,
  GetRecentType,
  GetStatsType,
  ImportFileType,
  OpenDocumentType,
  SelectFile
} from '../main/services/document/document.type'
import type {
  AddDocumentType,
  CreateFolderType,
  CreateSubfolderType,
  DeleteFolderType,
  editFolderTitleType,
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
        importFile: (documents: ImportFileType[]) => Promise<void>
        getAll: () => Promise<GetAllType>
        getRecent: () => Promise<GetRecentType>
        open: (path: string) => Promise<OpenDocumentType>
        delete: (id: number) => Promise<DeleteType>
        editDocumentTitle: (id: number, title: string) => Promise<void>
        stats: () => Promise<GetStatsType>
      }
      folder: {
        getRootFolders: () => Promise<GetFoldersType>
        get: (id: string) => Promise<GetFolderType>
        getSubfolders: (id: string) => Promise<GetFoldersType>
        editFolderTitle: (id: number, title: string) => Promise<editFolderTitleType>
        getDocuments: (id: string) => Promise<GetFolderDocumentsType>
        create: (name: string) => Promise<CreateFolderType>
        createSubfolder: (parentId: number, name: string) => Promise<CreateSubfolderType>
        delete: (id: number) => Promise<DeleteFolderType>
        addDocument: (folderId: stringId, documentId: number) => Promise<AddDocumentType>
        removeDocument: (folderId: stringId, documentId: string) => Promise<RemoveDocumentType>
      }
    }
  }
}
