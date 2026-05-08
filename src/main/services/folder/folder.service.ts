import DatabaseService from '../../db/database'
import type {
  AddDocumentType,
  CreateFolderType,
  CreateSubfolderType,
  DeleteFolderType,
  editFolderTitleType,
  Folder,
  FolderDocuments,
  GetDocumentsNotInFolderType,
  getFolderCountType,
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

  createSubfolder(parentId: number, name: string): CreateSubfolderType {
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

  getRootFolders(arg = 0): GetFoldersType {
    const page = arg < 2 ? 1 : arg
    const offset = 20 * (page - 1)
    try {
      const stmt = this.dbService.db.prepare<number, Folder>(`
        SELECT
          id,
          name,
          created_at
        FROM folders
        WHERE parent_id IS NULL
        LIMIT 20 OFFSET ?;
      `)
      const rows = stmt.all(offset)
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

  getSubfolders(id: string, arg = 1, text: string): GetFoldersType {
    const page = Math.max(1, arg)
    const offset = 11 * (page - 1)

    try {
      let query = `
      SELECT
        id,
        name,
        created_at
      FROM folders
      WHERE parent_id = ?
     `
      const params: (string | number)[] = [id]

      if (text.trim() !== '') {
        query += ` AND name LIKE ?`
        params.push(`%${text}%`)
      }

      query += `
      ORDER BY created_at DESC
      LIMIT 11 OFFSET ?
      `
      params.push(offset)
      const stmt = this.dbService.db.prepare<(string | number)[], Folder>(query)
      const rows = stmt.all(...params)

      return { success: true, data: rows }
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

  getDocumentsNotInFoler(id: number): GetDocumentsNotInFolderType {
    try {
      const stmt = this.dbService.db.prepare<number, FolderDocuments>(`
        SELECT d.*
         FROM documents d
         LEFT JOIN document_folders df
          ON d.id = df.document_id
          AND df.folder_id = ?
        WHERE df.document_id IS NULL;
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
  editFolderTitle(id: number, title: string): editFolderTitleType {
    try {
      const stmt = this.dbService.db.prepare(`
        UPDATE folders
        SET name = ?
        WHERE id = ? ;
      `)
      stmt.run(title, id)
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

  removeDocument(folderId: number, documentId: number): RemoveDocumentType {
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

  getAllFolderCount(): getFolderCountType {
    try {
      const stmtFolder = this.dbService.db.prepare(`
        SELECT count(*) as total_folder FROM folders
        WHERE parent_id IS NULL
        `)
      const data = stmtFolder.get() as { total_folder: number }

      return { success: true, data: data.total_folder }
    } catch {
      return { success: false }
    }
  }

  getAllSubFolderCount(parentFolderId: number, text?: string): getFolderCountType {
    try {
      let query = `
      SELECT COUNT(*) as total_folder
      FROM folders
      WHERE parent_id = ?
      `
      const params: (number | string)[] = [parentFolderId]
      if (text?.trim()) {
        query += ` AND name LIKE ?`
        params.push(`%${text.trim()}%`)
      }
      const stmtFolder = this.dbService.db.prepare(query)
      const data = stmtFolder.get(...params) as {
        total_folder: number
      }

      return { success: true, data: data.total_folder }
    } catch {
      return { success: false }
    }
  }
}

export default FolderService
