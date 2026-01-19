import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  //=========================== Documents ============================//
  document: {
    selectFile: () => ipcRenderer.invoke('document:select-files'),
    importFile: (paths: string[], category: string, tags: string) =>
      ipcRenderer.invoke('document:import', paths, category, tags),
    getAll: () => ipcRenderer.invoke('document:get-all'),
    getRecent: () => ipcRenderer.invoke('document:get-recentFiles'),
    open: (filePath: string) => ipcRenderer.invoke('document:open', filePath),
    delete: (id: string) => ipcRenderer.invoke('document:delete-file', id)
  },

  //=========================== Folders ============================//
  folder: {
    getAll: () => ipcRenderer.invoke('folder:get-all'),
    getDocuments: (id: string) => ipcRenderer.invoke('folder:get-document', id),
    create: (name: string) => ipcRenderer.invoke('folder:create', name),
    delete: (id: string) => ipcRenderer.invoke('folder:delete', id),
    addDocument: (folderId: string, documentId: string) =>
      ipcRenderer.invoke('folder:add-document', folderId, documentId),
    removeDocument: (folderId: string, documentId: string) =>
      ipcRenderer.invoke('folder:remove-document', folderId, documentId)
  },
  //=========================== Folders ============================//

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
