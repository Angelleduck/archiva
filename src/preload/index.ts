import { contextBridge, ipcRenderer } from 'electron'
import type {
  Document,
  DocumentStatus,
  ImportFileType
} from '../main/services/document/document.type'
import type { Folder } from '../main/services/folder/folder.type'

// Custom APIs for renderer
const api = {
  //=========================== Documents ============================//
  document: {
    selectFile: () => ipcRenderer.invoke('document:select-files'),
    importFile: (documents: ImportFileType[], category: string, tags: string) =>
      ipcRenderer.invoke('document:import', documents, category, tags),
    getAll: (page: number, text: string) => ipcRenderer.invoke('document:get-all', page, text),
    getRecent: () => ipcRenderer.invoke('document:get-recentFiles'),
    open: (filePath: string, status: DocumentStatus) =>
      ipcRenderer.invoke('document:open', filePath, status),
    delete: (data: Document[] | Document) => ipcRenderer.invoke('document:delete-file', data),
    stats: () => ipcRenderer.invoke('document:get-stats'),
    editDocumentTitle: (id: number, title: string) =>
      ipcRenderer.invoke('document:edit-title', id, title),
    getDocumentCount: (text: string) => ipcRenderer.invoke('document:count-all', text)
  },

  //=========================== Folders ============================//
  folder: {
    getRootFolders: (page: number, text: string) =>
      ipcRenderer.invoke('folder:get-rootFolders', page, text),
    get: (id: string) => ipcRenderer.invoke('folder:get', id),
    getSubfolders: (id: string, page: number, text: string) =>
      ipcRenderer.invoke('folder:getSubfolders', id, page, text),
    getDocuments: (id: string) => ipcRenderer.invoke('folder:get-document', id),
    editFolderTitle: (folder: Folder, title: string) =>
      ipcRenderer.invoke('folder:edit-title', folder, title),
    create: (name: string) => ipcRenderer.invoke('folder:create', name),
    createSubfolder: (parentId: number, name: string) =>
      ipcRenderer.invoke('folder:create-subfolder', parentId, name),
    delete: (id: Folder) => ipcRenderer.invoke('folder:delete', id),
    addDocument: (folderId: string, documentId: string) =>
      ipcRenderer.invoke('folder:add-document', folderId, documentId),
    removeDocument: (folderId: string, documentId: string) =>
      ipcRenderer.invoke('folder:remove-document', folderId, documentId),
    getFolderCount: (text: string) => ipcRenderer.invoke('folder:count-all', text),
    getSubfolderCount: (parentFolderId: number, text: string) =>
      ipcRenderer.invoke('folder:subfolder-CountAll', parentFolderId, text),
    getDocumentsNotInFolder: (id: number, arg: number, text: string) =>
      ipcRenderer.invoke('folder:get-documentNotInFolder', id, arg, text),

    countDocumentNotInFolder: (id: number, text: string) =>
      ipcRenderer.invoke('folder:countDocumentNotInFolder', id, text)
  },
  //====================================Store=================================//
  store: {
    check: () => ipcRenderer.invoke('store:check'),
    get: () => ipcRenderer.invoke('store:get'),
    update: () => ipcRenderer.invoke('store:update')
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
