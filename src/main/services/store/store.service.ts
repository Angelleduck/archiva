import conf from '../../store/store'
import { getStoreDataType } from './store.type'

class StoreService {
  getData(): getStoreDataType {
    try {
      const data = conf.get('path') as string
      return { success: true, data }
    } catch {
      return { success: false }
    }
  }
}

export default StoreService
