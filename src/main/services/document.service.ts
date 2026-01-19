import fs from 'node:fs'
import path from 'node:path'
import { AddFileProps } from '../../types/database'
import DatabaseService from '../db/database'

class DocumentService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  addFile(data: AddFileProps): { success: boolean } {
    try {
      const { filename, originalPath, category, tags } = data

      if (!fs.existsSync(originalPath)) {
        return { success: false }
      }

      const { size: fileSize } = fs.statSync(originalPath)
      const storedPath = path.join(this.dbService.documentsDir, filename)

      const stmt = this.dbService.db.prepare(
        'INSERT INTO documents (filename, path, size, type, category, tags) VALUES (?, ?, ?, ?, ?, ?)'
      )
      stmt.run(filename, storedPath, fileSize, 'pdf', category, tags)

      fs.copyFileSync(originalPath, storedPath)

      return { success: true }
    } catch {
      return { success: false }
    }
  }

  getAll(): unknown[] {
    const stmt = this.dbService.db.prepare('SELECT * FROM documents')
    return stmt.all()
  }

  getRecent(): unknown[] {
    try {
      const stmt = this.dbService.db.prepare(`
        SELECT * FROM documents
        ORDER BY id DESC
        LIMIT 5
      `)
      return stmt.all()
    } catch {
      return []
    }
  }

  delete(id: string): void {
    try {
      console.log('deleted')

      const stmtPath = this.dbService.db.prepare(`
        SELECT path FROM documents
        WHERE id = ?
      `)
      const result = stmtPath.get(id) as { path: string }

      const stmt = this.dbService.db.prepare('DELETE FROM documents WHERE id = ?')
      stmt.run(id)

      fs.unlink(result.path, (err) => {
        if (err) throw err
      })
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
}

export default DocumentService
