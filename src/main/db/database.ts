import { app } from 'electron'
import path from 'node:path'
import Database, { type Database as dbType } from 'better-sqlite3'
import fs from 'node:fs'

class DatabaseService {
  private static instance: DatabaseService
  db: dbType
  documentsDir: string

  constructor() {
    const userDataPath = path.join(app.getPath('userData'), 'file-data')
    const dbPath = path.join(userDataPath, 'database.db')

    const documentPath = path.join(userDataPath, 'document')

    // Créer le dossier file-data s'il n'existe pas
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true })
    }

    // Créer le dossier document s'il n'existe pas
    if (!fs.existsSync(documentPath)) {
      fs.mkdirSync(documentPath, { recursive: true })
    }

    console.log(dbPath)
    this.db = new Database(dbPath)
    //enable foreign key
    this.db.pragma('foreign_keys = ON')
    this.db.pragma('journal_mode = WAL')
    this.setUpDatabase()
    this.documentsDir = documentPath
  }
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }
  setUpDatabase(): void {
    this.db.exec(
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        path TEXT NOT NULL,
        size INTEGER,
        type TEXT NOT NULL,
        category TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    )

    this.db.exec(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#FF6B35',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

    this.db.exec(`
    CREATE TABLE IF NOT EXISTS document_folders (
     document_id INTEGER NOT NULL,
     folder_id INTEGER NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

     PRIMARY KEY (document_id, folder_id),

     FOREIGN KEY (document_id)
     REFERENCES documents(id)
     ON DELETE CASCADE,

     FOREIGN KEY (folder_id)
     REFERENCES folders(id)
     ON DELETE CASCADE
    );
  `)
    console.log('db initialized!')
  }
}

export default DatabaseService
