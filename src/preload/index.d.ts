import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  DeleteType,
  editDocumentTitleType,
  GetAllType,
  getDocumentCountType,
  GetRecentType,
  GetStatsType,
  ImportFileType,
  OpenDocumentType,
  SelectFile
} from '../main/services/document/document.type'
import type {
  AddDocumentType,
  countDocumentNotInFolderType,
  CreateFolderType,
  CreateSubfolderType,
  DeleteFolderType,
  editFolderTitleType,
  GetDocumentsNotInFolderType,
  getFolderCountType,
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
        getAll: (offset: number, text: string) => Promise<GetAllType>
        getRecent: () => Promise<GetRecentType>
        open: (path: string) => Promise<OpenDocumentType>
        delete: (id: number) => Promise<DeleteType>
        editDocumentTitle: (id: number, title: string) => Promise<editDocumentTitleType>
        stats: () => Promise<GetStatsType>
        getDocumentCount: (searchText: string) => Promise<getDocumentCountType>
      }
      folder: {
        getRootFolders: (page: number) => Promise<GetFoldersType>
        get: (id: string) => Promise<GetFolderType>
        getSubfolders: (id: string, page: number, text: string) => Promise<GetFoldersType>
        editFolderTitle: (id: number, title: string) => Promise<editFolderTitleType>
        getDocuments: (id: string) => Promise<GetFolderDocumentsType>
        create: (name: string) => Promise<CreateFolderType>
        createSubfolder: (parentId: number, name: string) => Promise<CreateSubfolderType>
        delete: (id: number) => Promise<DeleteFolderType>
        addDocument: (folderId: number, documentId: number) => Promise<AddDocumentType>
        removeDocument: (folderId: number, documentId: number) => Promise<RemoveDocumentType>
        getFolderCount: () => Promise<getFolderCountType>
        getSubfolderCount: (id: number, text: string) => Promise<getFolderCountType>
        getDocumentsNotInFolder: (
          folderId: number,
          arg: number,
          text: string
        ) => Promise<GetDocumentsNotInFolderType>
        countDocumentNotInFolder: (
          id: number,
          text: string
        ) => Promise<countDocumentNotInFolderType>
      }
    }
  }
}
