import { contextBridge, ipcRenderer } from 'electron'
import type {
  DeleteType,
  editDocumentTitleType,
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
    getAll: (offset: number, text: string): Promise<GetAllType> =>
      ipcRenderer.invoke('document:get-all', offset, text),
    getRecent: (): Promise<GetRecentType> => ipcRenderer.invoke('document:get-recentFiles'),
    open: (filePath: string): Promise<OpenDocumentType> =>
      ipcRenderer.invoke('document:open', filePath),
    delete: (id: number): Promise<DeleteType> => ipcRenderer.invoke('document:delete-file', id),
    stats: (): Promise<GetStatsType> => ipcRenderer.invoke('document:get-stats'),
    editDocumentTitle: (id: number, title: string): Promise<editDocumentTitleType> =>
      ipcRenderer.invoke('document:edit-title', id, title),
    getDocumentCount: (text: string): Promise<void> =>
      ipcRenderer.invoke('document:count-all', text)
  },

  //=========================== Folders ============================//
  folder: {
    getRootFolders: (): Promise<GetFoldersType> => ipcRenderer.invoke('folder:get-rootFolders'),
    get: (id: string): Promise<GetFolderType> => ipcRenderer.invoke('folder:get', id),
    getSubfolders: (id: string): Promise<GetFoldersType> =>
      ipcRenderer.invoke('folder:getSubfolders', id),
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
      ipcRenderer.invoke('folder:remove-document', folderId, documentId)
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
