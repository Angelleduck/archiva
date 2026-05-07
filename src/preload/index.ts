import { contextBridge, ipcRenderer } from 'electron'
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
  CreateFolderType,
  CreateSubfolderType,
  DeleteFolderType,
  GetDocumentsNotInFolderType,
  getFolderCountType,
  GetFolderDocumentsType,
  GetFoldersType,
  GetFolderType,
  RemoveDocumentType
} from '../main/services/folder/folder.type'

// Custom APIs for renderer
const api = {
  //=========================== Documents ============================//
  document: {
    selectFile: (): Promise<SelectFile> => ipcRenderer.invoke('document:select-files'),
    importFile: (documents: ImportFileType[], category: string, tags: string) =>
      ipcRenderer.invoke('document:import', documents, category, tags),
    getAll: (page: number, text: string): Promise<GetAllType> =>
      ipcRenderer.invoke('document:get-all', page, text),
    getRecent: (): Promise<GetRecentType> => ipcRenderer.invoke('document:get-recentFiles'),
    open: (filePath: string): Promise<OpenDocumentType> =>
      ipcRenderer.invoke('document:open', filePath),
    delete: (id: number): Promise<DeleteType> => ipcRenderer.invoke('document:delete-file', id),
    stats: (): Promise<GetStatsType> => ipcRenderer.invoke('document:get-stats'),
    editDocumentTitle: (id: number, title: string): Promise<editDocumentTitleType> =>
      ipcRenderer.invoke('document:edit-title', id, title),
    getDocumentCount: (text: string): Promise<getDocumentCountType> =>
      ipcRenderer.invoke('document:count-all', text)
  },

  //=========================== Folders ============================//
  folder: {
    getRootFolders: (page: number): Promise<GetFoldersType> =>
      ipcRenderer.invoke('folder:get-rootFolders', page),
    get: (id: string): Promise<GetFolderType> => ipcRenderer.invoke('folder:get', id),
    getSubfolders: (id: string, page: number): Promise<GetFoldersType> =>
      ipcRenderer.invoke('folder:getSubfolders', id, page),
    getDocuments: (id: string): Promise<GetFolderDocumentsType> =>
      ipcRenderer.invoke('folder:get-document', id),
    editFolderTitle: (id: number, title: string) =>
      ipcRenderer.invoke('folder:edit-title', id, title),
    create: (name: string): Promise<CreateFolderType> => ipcRenderer.invoke('folder:create', name),
    createSubfolder: (parentId: number, name: string): Promise<CreateSubfolderType> =>
      ipcRenderer.invoke('folder:create-subfolder', parentId, name),
    delete: (id: number): Promise<DeleteFolderType> => ipcRenderer.invoke('folder:delete', id),
    addDocument: (folderId: string, documentId: string): Promise<AddDocumentType> =>
      ipcRenderer.invoke('folder:add-document', folderId, documentId),
    removeDocument: (folderId: string, documentId: string): Promise<RemoveDocumentType> =>
      ipcRenderer.invoke('folder:remove-document', folderId, documentId),
    getFolderCount: (text: string): Promise<getFolderCountType> =>
      ipcRenderer.invoke('folder:count-all', text),
    getSubfolderCount: (): Promise<getFolderCountType> =>
      ipcRenderer.invoke('folder:subfolder-CountAll'),
    getDocumentsNotInFolder: (id: number): Promise<GetDocumentsNotInFolderType> =>
      ipcRenderer.invoke('folder:get-documentNotInFolder', id)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {})
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
