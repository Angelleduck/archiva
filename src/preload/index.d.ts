import { ElectronAPI } from '@electron-toolkit/preload'
import type { GetDocument } from '../types/document'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      document: {
        selectFile: () => Promise<GetDocument>
        importFile: (
          paths: string[],
          category: string | undefined,
          tags: string | undefined
        ) => Promise<void>
        getAll: () => Promise<string[]>
        getRecent: () => Promise<string[]>
        open: (path: string) => Promise<void>
        delete: (id: string) => Promise<string[]>
      }
      folder: {
        getAll: () => Promise<void>
        getDocuments: (id: string) => Promise<void>
        create: (name: string) => Promise<void>
        delete: (id: string) => Promise<void>
        addDocument: (folderId: stringId, documentId: string) => Promise<void>
        removeDocument: (folderId: stringId, documentId: string) => Promise<void>
      }
      search: {
        query: (params: any) => Promise<void>
      }
    }
  }
}
