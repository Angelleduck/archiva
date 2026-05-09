import fs from 'node:fs'
import path from 'node:path'
import DatabaseService from '../../db/database'
import type {
  AddFileProps,
  AddFileType,
  DeleteType,
  Document,
  editDocumentTitleType,
  GetAllType,
  getDocumentCountType,
  GetRecentType,
  GetStatsType
} from './document.type'

class DocumentService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  addFile(data: AddFileProps): AddFileType {
    try {
      const { filename, originalPath } = data

      if (!fs.existsSync(originalPath)) {
        return { success: false }
      }

      const { size: fileSize } = fs.statSync(originalPath)
      const storedPath = path.join(this.dbService.documentsDir, filename)

      const stmt = this.dbService.db.prepare(
        'INSERT INTO documents (filename, path, size) VALUES (?, ?, ?)'
      )
      stmt.run(filename, storedPath, fileSize)

      fs.copyFileSync(originalPath, storedPath)

      return { success: true }
    } catch {
      return { success: false }
    }
  }

  getAll(arg: number, text: string): GetAllType {
    const page = Math.max(1, arg)
    const offset = 20 * (page - 1)

    try {
      let query = `SELECT * FROM documents`
      const params: (string | number)[] = [] // <-- proper type

      if (text && text.trim() !== '') {
        query += ` WHERE filename LIKE ?`
        params.push(`%${text}%`)
      }

      query += ` LIMIT 20 OFFSET ?`
      params.push(offset)

      const stmt = this.dbService.db.prepare<(string | number)[], Document>(query)
      const rows = stmt.all(...params)

      return { success: true, data: rows }
    } catch {
      return { success: false }
    }
  }

  getRecent(): GetRecentType {
    try {
      const stmt = this.dbService.db.prepare<[], Document>(`
        SELECT * FROM documents
        ORDER BY id DESC
        LIMIT 5
      `)
      const rows = stmt.all()
      return { success: true, data: rows }
    } catch {
      return { success: false }
    }
  }

  delete(id: number): DeleteType {
    try {
      // later  verify path

      const stmtPath = this.dbService.db.prepare(`
        SELECT path FROM documents
        WHERE id = ?
      `)
      const result = stmtPath.get(id) as { path: string }

      const stmt = this.dbService.db.prepare('DELETE FROM documents WHERE id = ?')
      stmt.run(id)

      // if path doesn't exist it means file has been deleted or renamed manually
      if (!fs.existsSync(result.path)) {
        return { success: true, message: 'fichier supprimé' }
      }

      fs.unlink(result.path, (err) => {
        if (err) throw err
      })

      return { success: true }
    } catch {
      return { success: false }
    }
  }

  editDocumentTitle(id: number, title: string): editDocumentTitleType {
    try {
      const stmt = this.dbService.db.prepare(`
        UPDATE documents
        SET filename = ?
        WHERE id = ? ;
      `)
      stmt.run(title, id)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  getAllDocumentCount(text?: string): getDocumentCountType {
    try {
      let query = `SELECT count(*) as total_file FROM documents`
      const params: string[] = []

      if (text && text.trim() !== '') {
        query += ` WHERE filename LIKE ?`
        params.push(`%${text}%`)
      }

      const stmtFile = this.dbService.db.prepare(query)
      const data = stmtFile.get(...params) as { total_file: number }

      return { success: true, data: data.total_file }
    } catch {
      return { success: false }
    }
  }

  getStats(): GetStatsType {
    try {
      const stmtFile = this.dbService.db.prepare(`
        SELECT count(*) as total_file FROM documents;
      `)
      const stmtFolder = this.dbService.db.prepare(`
        SELECT count(*) as total_folder FROM folders;
        `)
      const stmtSize = this.dbService.db.prepare(`
        SELECT sum(size) as total_size FROM documents;
        `)
      const data_file = stmtFile.get() as { total_file: number }
      const data_folder = stmtFolder.get() as { total_folder: number }
      const data_size = stmtSize.get() as { total_size: number }

      const data = {
        total_file: data_file.total_file,
        total_folder: data_folder.total_folder,
        total_size: data_size.total_size
      }

      return { success: true, data }
    } catch {
      return { success: false }
    }
  }
}

export default DocumentService
