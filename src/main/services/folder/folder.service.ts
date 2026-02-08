import DatabaseService from '../../db/database'
import type {
  AddDocumentType,
  CreateFolderType,
  DeleteFolderType,
  Folder,
  FolderDocuments,
  GetFolderDocumentsType,
  GetFoldersType,
  GetFolderType,
  RemoveDocumentType
} from './folder.type'

class FolderService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  createFolder(name: string): CreateFolderType {
    try {
      const stmt = this.dbService.db.prepare(`
        INSERT INTO folders(name)
        VALUES(?)
      `)
      stmt.run(name)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  createSubfolder(parentId: number, name: string) {
    try {
      const stmt = this.dbService.db.prepare(`
        INSERT INTO folders(parent_id,name)
        VALUES(?,?)
      `)
      stmt.run(parentId, name)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  getRootFolders(): GetFoldersType {
    try {
      const stmt = this.dbService.db.prepare<Folder[], Folder>(`
        SELECT
          id,
          name
        FROM folders
        WHERE parent_id IS NULL;
      `)
      const rows = stmt.all()
      return { success: true, data: rows }
    } catch {
      return { success: false }
    }
  }

  getFolder(id: string): GetFolderType {
    try {
      const stmt = this.dbService.db.prepare<string, Folder>(`
        SELECT
          id,
          name,
          created_at
        FROM folders
        WHERE id = ?;
      `)
      const row = stmt.get(id)
      return { success: true, data: row }
    } catch {
      return { success: false }
    }
  }

  getSubfolders(id: string): GetFoldersType {
    try {
      const stmt = this.dbService.db.prepare<string, Folder>(`
        SELECT
          id,
          name,
          created_at
        FROM folders
        WHERE parent_id = ?;
        `)

      const row = stmt.all(id)
      return { success: true, data: row }
    } catch {
      return { success: false }
    }
  }

  getFolderDocuments(id: string): GetFolderDocumentsType {
    try {
      const stmt = this.dbService.db.prepare<string, FolderDocuments>(`
        SELECT
          d.id,
          d.filename,
          d.path,
          d.created_at,
          d.size
        FROM documents d
        INNER JOIN document_folders df
          ON d.id = df.document_id
        WHERE df.folder_id = ?;
      `)
      const rows = stmt.all(id)
      return { success: true, data: rows }
    } catch {
      return { success: false }
    }
  }

  deleteFolder(id: number): DeleteFolderType {
    try {
      const stmt = this.dbService.db.prepare(`
        DELETE FROM folders
        WHERE id = ?
      `)
      stmt.run(id)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  addDocument(folderId: string, documentId: string): AddDocumentType {
    try {
      const stmt = this.dbService.db.prepare(`
        INSERT INTO document_folders(folder_id,document_id)
        VALUES(?,?)
      `)
      stmt.run(folderId, documentId)

      return { success: true }
    } catch {
      return { success: false }
    }
  }

  removeDocument(folderId: string, documentId: string): RemoveDocumentType {
    try {
      const stmt = this.dbService.db.prepare(`
        DELETE FROM document_folders
        WHERE folder_id=? AND document_id=?
      `)
      stmt.run(folderId, documentId)
      return { success: true }
    } catch {
      return { success: false }
    }
  }
}

export default FolderService
