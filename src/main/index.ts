import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import DocumentService from './services/document/document.service'
import FolderService from './services/folder/folder.service'
import fs from 'node:fs'
import path from 'node:path'
import type {
  DeleteType,
  GetAllType,
  GetRecentType,
  OpenDocumentType,
  SelectFile
} from './services/document/document.type'
import {
  CreateFolderType,
  DeleteFolderType,
  GetFolderDocumentsType,
  GetFoldersType,
  GetFolderType,
  AddDocumentType,
  RemoveDocumentType
} from './services/folder/folder.type'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  const documentService = new DocumentService()
  const folderService = new FolderService()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //=========================== Documents ============================//

  ipcMain.handle('document:select-files', async (): Promise<SelectFile> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Documents', extensions: ['pdf'] }]
    })
    if (canceled) {
      return { success: false }
    }

    const documents = filePaths.map((item) => ({
      filename: path.basename(item),
      path: item
    }))
    return { success: true, data: documents }
  })

  ipcMain.handle('document:import', async (_event, documents) => {
    for (const document of documents) {
      documentService.addFile({
        filename: document.filename,
        originalPath: document.path
      })
    }
  })

  ipcMain.handle('document:open', async (_event, filePath: string): Promise<OpenDocumentType> => {
    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: "impossible d'ouvrir le fichier. \n Supprimez et re-importez le fichier."
        }
      }
      await shell.openPath(filePath)
      return { success: true }
    } catch {
      return {
        success: false,
        message: "impossible d'ouvrir le fichier. \n Supprimez et re-importez le fichier."
      }
    }
  })

  ipcMain.handle('document:get-all', async (): Promise<GetAllType> => {
    return documentService.getAll()
  })

  ipcMain.handle('document:get-recentFiles', async (): Promise<GetRecentType> => {
    return documentService.getRecent()
  })

  ipcMain.handle('document:delete-file', async (_event, id: number): Promise<DeleteType> => {
    return documentService.delete(id)
  })

  ipcMain.handle('document:get-stats', async () => {
    return documentService.getStats()
  })

  //=========================== Folders ============================//

  ipcMain.handle('folder:create', async (_event, name): Promise<CreateFolderType> => {
    return folderService.createFolder(name)
  })
  ipcMain.handle(
    'folder:create-subfolder',
    async (_event, parentId, name): Promise<CreateFolderType> => {
      return folderService.createSubfolder(parentId, name)
    }
  )

  ipcMain.handle('folder:get-rootFolders', async (): Promise<GetFoldersType> => {
    return folderService.getRootFolders()
  })
  ipcMain.handle('folder:get', async (_event, id: string): Promise<GetFolderType> => {
    return folderService.getFolder(id)
  })
  ipcMain.handle('folder:getSubfolders', async (_event, id: string): Promise<GetFoldersType> => {
    return folderService.getSubfolders(id)
  })
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
    async (_event, folderId: string, documentId: string): Promise<RemoveDocumentType> => {
      return folderService.removeDocument(folderId, documentId)
    }
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
