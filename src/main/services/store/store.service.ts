import { dialog } from 'electron'
import conf from '../../store/store'
import type { getStoreDataType, updatePathType } from './store.type'

class StoreService {
  getData(): getStoreDataType {
    try {
      const data = conf.get('path') as string
      return { success: true, data }
    } catch {
      return { success: false }
    }
  }

  async updatePath(): Promise<updatePathType> {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Choose where to store your documents',
        buttonLabel: 'Select Folder'
      })

      if (canceled || filePaths.length === 0) {
        return null
      }
      conf.set('path', filePaths[0])
      return { success: true }
    } catch {
      return { success: false }
    }
  }
}

export default StoreService
