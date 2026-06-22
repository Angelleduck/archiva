import { ipcMain } from 'electron'
import type StoreService from '../services/store/store.service'
export function registerStoreIpc(storeService: StoreService): void {
  ipcMain.handle('store:get', () => {
    return storeService.getData()
  })

  ipcMain.handle('store:update', async () => {
    return storeService.updatePath()
  })
}
