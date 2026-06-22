import type DocumentService from './services/document/document.service'
import type FolderService from './services/folder/folder.service'
import type StoreService from './services/store/store.service'
import { registerDocumentIpc } from './ipc/document.ipc'
import { registerFolderIpc } from './ipc/folder.ipc'
import { registerStoreIpc } from './ipc/store.ipc'

export function registerIpc({
  documentService,
  folderService,
  storeService
}: {
  documentService: DocumentService
  folderService: FolderService
  storeService: StoreService
}): void {
  registerDocumentIpc(documentService)
  registerFolderIpc(folderService)
  registerStoreIpc(storeService)
}
