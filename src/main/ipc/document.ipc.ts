import type DocumentService from '../services/document/document.service'
import { dialog, ipcMain, shell } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

import type {
  DeleteType,
  Document,
  DocumentStatus,
  GetAllType,
  GetRecentType,
  GetStatsType,
  ImportDocucmentType,
  ImportFileType,
  OpenDocumentType,
  SelectFile
} from '../services/document/document.type'

export function registerDocumentIpc(documentService: DocumentService): void {
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

  ipcMain.handle('document:get-all', (_event, offset: number, text: string): GetAllType => {
    return documentService.getAll(offset, text)
  })

  ipcMain.handle('document:get-recentFiles', (): GetRecentType => {
    return documentService.getRecent()
  })

  ipcMain.handle(
    'document:delete-file',
    (_event, data: Document[] | Document): Promise<DeleteType> => {
      if (Array.isArray(data)) {
        return documentService.deleteMultipleFiles(data)
      } else {
        return documentService.deleteSingleFile(data)
      }
    }
  )

  ipcMain.handle('document:get-stats', (): GetStatsType => {
    return documentService.getStats()
  })

  ipcMain.handle('document:edit-title', async (_event, folderId: number, title: string) => {
    return documentService.editDocumentTitle(folderId, title)
  })

  ipcMain.handle('document:count-all', (_event, text: string) => {
    return documentService.getAllDocumentCount(text)
  })
}
