import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import DocumentService from './services/document/document.service'
import FolderService from './services/folder/folder.service'
import fs from 'node:fs'
import path from 'node:path'
import type {
  DeleteType,
  DocumentStatus,
  GetAllType,
  GetRecentType,
  GetStatsType,
  ImportDocucmentType,
  ImportFileType,
  OpenDocumentType,
  SelectFile
} from './services/document/document.type'
import type {
  CreateFolderType,
  DeleteFolderType,
  GetFolderDocumentsType,
  GetFoldersType,
  GetFolderType,
  AddDocumentType,
  RemoveDocumentType,
  CreateSubfolderType
} from './services/folder/folder.type'
import conf from './store/store'
import StoreService from './services/store/store.service'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    icon,
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

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  const documentService = new DocumentService()
  const folderService = new FolderService()
  const storeService = new StoreService()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  if (!conf.has('path')) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Choose where to store your documents',
      buttonLabel: 'Select Folder'
    })

    if (canceled || filePaths.length === 0) {
      app.quit() // directory is required, can't continue
      return
    }
    conf.set('path', filePaths[0])
  }

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

  ipcMain.handle('document:import', (_event, documents: ImportFileType[]): ImportDocucmentType => {
    const filesNotImported: string[] = []
    for (const document of documents) {
      const { fileNotImported } = documentService.addFile({
        filename: document.filename,
        originalPath: document.path
      })
      if (fileNotImported) filesNotImported.push(fileNotImported)
    }
    return { filesNotImported }
  })

  ipcMain.handle(
    'document:open',
    async (_event, filePath: string, status: DocumentStatus): Promise<OpenDocumentType> => {
      try {
        if (!fs.existsSync(filePath)) {
          const extraMessage =
            status === 'Already imported' ? '\nSupprimer et re-importer le fichier.' : ''
          return { success: false, message: `Impossible d'ouvrir le fichier.${extraMessage}` }
        }
        await shell.openPath(filePath)
        return { success: true }
      } catch {
        const extraMessage =
          status === 'Already imported' ? '\nSupprimer et re-importer le fichier.' : ''
        return { success: false, message: `Impossible d'ouvrir le fichier.${extraMessage}` }
      }
    }
  )

  ipcMain.handle(
    'document:get-all',
    async (_event, offset: number, text: string): Promise<GetAllType> => {
      return documentService.getAll(offset, text)
    }
  )

  ipcMain.handle('document:get-recentFiles', async (): Promise<GetRecentType> => {
    return documentService.getRecent()
  })

  ipcMain.handle('document:delete-file', async (_event, id: number): Promise<DeleteType> => {
    return documentService.delete(id)
  })

  ipcMain.handle('document:get-stats', async (): Promise<GetStatsType> => {
    return documentService.getStats()
  })

  ipcMain.handle('document:edit-title', async (_event, folderId: number, title: string) => {
    return documentService.editDocumentTitle(folderId, title)
  })

  ipcMain.handle('document:count-all', async (_event, text: string) => {
    return documentService.getAllDocumentCount(text)
  })

  //=========================== Folders ============================//

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

  //=================================Store==================================//

  ipcMain.handle('store:get', () => {
    return storeService.getData()
  })

  ipcMain.handle('store:update', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Choose where to store your documents',
      buttonLabel: 'Select Folder'
    })

    if (canceled || filePaths.length === 0) {
      return
    }
    conf.set('path', filePaths[0])
  })

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
