import DatabaseService from '../db/database'

class FolderService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }
}

export default FolderService
