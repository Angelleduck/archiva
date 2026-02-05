import DatabaseService from '../../db/database'
import type {
  AddDocumentType,
  CreateFolderType,
  DeleteFolderType,
  DocumentWithCount,
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

  getFolders(): GetFoldersType {
    try {
      const stmt = this.dbService.db.prepare<DocumentWithCount[], DocumentWithCount>(`
        SELECT
          f.id,
          f.name,
          f.color,
          COUNT(df.document_id) AS document_count
        FROM folders AS f
        LEFT JOIN document_folders AS df
          ON f.id = df.folder_id
        GROUP BY f.id;
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
          name
        FROM folders
        WHERE id = ?;
      `)
      const row = stmt.get(id)
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

  deleteFolder(id: string): DeleteFolderType {
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
