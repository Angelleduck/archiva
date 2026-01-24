import DatabaseService from '../db/database'

class SearchService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  document({ q, category, favory }: { q: string; category?: string; favory?: boolean }): void {
    try {
      const conditions: string[] = []
      const params: any[] = []

      // Always search by filename if q is provided
      if (q) {
        conditions.push('filename LIKE ?')
        params.push(`%${q}%`)
      }

      // Add category filter if provided
      if (category) {
        conditions.push('category = ?')
        params.push(category)
      }

      // Add favory filter if provided
      if (favory !== undefined) {
        conditions.push('favory = ?')
        params.push(favory)
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      const stmt = this.dbService.db.prepare(`
        SELECT * FROM documents
        ${whereClause}
      `)

      console.log(stmt.all(...params))
      return stmt.all(...params)
    } catch (error) {
      console.log(error)
      return []
    }
  }
}

export default SearchService
