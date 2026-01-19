import DatabaseService from '../db/database'

class FolderService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  createFolder(name: string): void {
    try {
      const stmt = this.dbService.db.prepare(`
        INSERT INTO folders(name)
        VALUES(?)
      `)
      stmt.run(name)
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  getFolders(): any[] {
    try {
      const stmt = this.dbService.db.prepare(`
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
      return stmt.all()
    } catch (error) {
      console.error('Error getting folders:', error)
      return []
    }
  }

  getFolder(id: string): any[] {
    try {
      const stmt = this.dbService.db.prepare(`
        SELECT
          d.id,
          d.filename,
          d.path,
          d.created_at
        FROM documents d
        INNER JOIN document_folders df
          ON d.id = df.document_id
        WHERE df.folder_id = ?;
      `)
      const rows = stmt.all(id)
      return rows
    } catch (error) {
      console.error('Error getting folder:', error)
      return []
    }
  }

  deleteFolder(id: string): void {
    try {
      const stmt = this.dbService.db.prepare(`
        DELETE FROM folders
        WHERE id = ?
      `)
      stmt.run(id)
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  addDocument(folderId: string, documentId: string): void {
    try {
      const stmt = this.dbService.db.prepare(`
        INSERT INTO document_folders(folder_id,document_id)
        VALUES(?,?)
      `)
      stmt.run(folderId, documentId)
    } catch {}
  }

  removeDocument(folderId: string, documentId: string): void {
    try {
      const stmt = this.dbService.db.prepare(`
        DELETE FROM document_folders
        WHERE folder_id=? AND document_id=?
      `)
      stmt.run(folderId, documentId)
    } catch {}
  }
}

export default FolderService
