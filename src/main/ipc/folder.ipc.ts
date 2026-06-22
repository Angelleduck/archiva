import type FolderService from '../services/folder/folder.service'
import { ipcMain } from 'electron'

import type {
  CreateFolderType,
  DeleteFolderType,
  GetFolderDocumentsType,
  GetFoldersType,
  GetFolderType,
  AddDocumentType,
  RemoveDocumentType,
  CreateSubfolderType
} from '../services/folder/folder.type'

export function registerFolderIpc(folderService: FolderService): void {
  ipcMain.handle('folder:create', async (_event, name): Promise<CreateFolderType> => {
    return folderService.createFolder(name)
  })
  ipcMain.handle(
    'folder:create-subfolder',
    async (_event, parentId, name): Promise<CreateSubfolderType> => {
      return folderService.createSubfolder(parentId, name)
    }
  )

  ipcMain.handle(
    'folder:get-rootFolders',
    async (_event, page: number, text: string): Promise<GetFoldersType> => {
      return folderService.getRootFolders(page, text)
    }
  )
  ipcMain.handle('folder:get', async (_event, id: string): Promise<GetFolderType> => {
    return folderService.getFolder(id)
  })
  ipcMain.handle(
    'folder:getSubfolders',
    async (_event, id: string, page: number, text: string): Promise<GetFoldersType> => {
      return folderService.getSubfolders(id, page, text)
    }
  )
  ipcMain.handle(
    'folder:get-document',
    async (_event, id: string): Promise<GetFolderDocumentsType> => {
      return folderService.getFolderDocuments(id)
    }
  )
  ipcMain.handle('folder:delete', async (_event, id: number): Promise<DeleteFolderType> => {
    return folderService.deleteFolder(id)
  })
  ipcMain.handle(
    'folder:add-document',
    async (_event, folderId: string, documentId: string): Promise<AddDocumentType> => {
      return folderService.addDocument(folderId, documentId)
    }
  )
  ipcMain.handle(
    'folder:remove-document',
    async (_event, folderId: number, documentId: number): Promise<RemoveDocumentType> => {
      return folderService.removeDocument(folderId, documentId)
    }
  )

  ipcMain.handle('folder:edit-title', async (_event, folderId: number, title: string) => {
    return folderService.editFolderTitle(folderId, title)
  })

  ipcMain.handle('folder:count-all', async (_event, text: string) => {
    return folderService.getAllFolderCount(text)
  })
  ipcMain.handle(
    'folder:subfolder-CountAll',
    async (_event, parentFolderId: number, text: string) => {
      return folderService.getAllSubFolderCount(parentFolderId, text)
    }
  )
  ipcMain.handle(
    'folder:get-documentNotInFolder',
    async (_event, id: number, arg: number, text: string) => {
      return folderService.getDocumentsNotInFoler(id, arg, text)
    }
  )
  ipcMain.handle('folder:countDocumentNotInFolder', async (_event, id: number, text: string) => {
    return folderService.countDocumentsNotInFoler(id, text)
  })
}
