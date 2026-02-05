import { contextBridge, ipcRenderer } from 'electron'
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

// Custom APIs for renderer
const api = {
  //=========================== Documents ============================//
  document: {
    selectFile: (): Promise<SelectFile> => ipcRenderer.invoke('document:select-files'),
    importFile: (documents: Record<string, any>[], category: string, tags: string) =>
      ipcRenderer.invoke('document:import', documents, category, tags),
    getAll: (): Promise<GetAllType> => ipcRenderer.invoke('document:get-all'),
    getRecent: (): Promise<GetRecentType> => ipcRenderer.invoke('document:get-recentFiles'),
    open: (filePath: string): Promise<OpenDocumentType> =>
      ipcRenderer.invoke('document:open', filePath),
    delete: (id: string): Promise<DeleteType> => ipcRenderer.invoke('document:delete-file', id),
    stats: (): Promise<any> => ipcRenderer.invoke('document:get-stats')
  },

  //=========================== Folders ============================//
  folder: {
    getAll: (): Promise<GetFoldersType> => ipcRenderer.invoke('folder:get-all'),
    get: (id: string): Promise<GetFolderType> => ipcRenderer.invoke('folder:get', id),
    getDocuments: (id: string): Promise<GetFolderDocumentsType> =>
      ipcRenderer.invoke('folder:get-document', id),
    create: (name: string): Promise<CreateFolderType> => ipcRenderer.invoke('folder:create', name),
    delete: (id: string): Promise<DeleteFolderType> => ipcRenderer.invoke('folder:delete', id),
    addDocument: (folderId: string, documentId: string): Promise<AddDocumentType> =>
      ipcRenderer.invoke('folder:add-document', folderId, documentId),
    removeDocument: (folderId: string, documentId: string): Promise<RemoveDocumentType> =>
      ipcRenderer.invoke('folder:remove-document', folderId, documentId)
  },
  //=========================== Search ============================//

  search: {
    query: (params: any) => ipcRenderer.invoke('search:document', params)
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
