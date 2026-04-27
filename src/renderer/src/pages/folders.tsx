import { FolderModal } from '@renderer/components/folder/modal/add-folder'
import { DeleteModal } from '@renderer/components/folder/modal/delete'
import { EditTitleModal } from '@renderer/components/folder/modal/edit-title'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Folder } from 'src/main/services/folder/folder.type'
import { FolderItem } from '@renderer/components/folder/folder-item'
import Loader from '@renderer/components/document/loader'

export default function Folders(): React.JSX.Element {
  const [folders, setFolders] = useState<Folder[]>([])
  const [showModal, setShowModal] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEdidtTitleModal, setShowEditTileModal] = useState(false)
  const [folderObject, setfolderObject] = useState({ name: '', id: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function sleep(): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, 150))
    }

    async function getFolders(): Promise<void> {
      // Wait for both the fetch and the minimum delay
      const [result] = await Promise.all([window.api.folder.getRootFolders(), sleep()])
      if (result.success) {
        setFolders(result.data)
      }
      setIsLoading(false)
    }
    getFolders()
  }, [trigger])

  const handleCloseModal = (): void => {
    setShowModal(false)
  }

  const handleTrigger = (): void => {
    setTrigger((prev) => prev + 1)
  }

  const handleDelete = async (id: number): Promise<void> => {
    const result = await window.api.folder.delete(id)

    if (result.success) {
      setFolders((prev) => prev.filter((doc) => doc.id !== id))
    }
    handleCloseDeleteModal()
  }

  const handleEdit = async (id: number, title: string): Promise<void> => {
    window.api.folder.editFolderTitle(id, title)
    handleCloseEditTitleModal()
    setTrigger((prev) => prev + 1)
  }

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

  const handleCloseEditTitleModal = (): void => {
    setShowEditTileModal(false)
  }

  const handleSelectFolder = useCallback((folder: Folder, purpose: 'delete' | 'edit'): void => {
    setfolderObject({ id: folder.id, name: folder.name })
    if (purpose == 'delete') {
      setShowDeleteModal(true)
    } else {
      setShowEditTileModal(true)
    }
  }, [])

  if (isLoading) return <Loader />

  return (
    <>
      {showEdidtTitleModal && (
        <EditTitleModal
          onCloseModal={handleCloseEditTitleModal}
          name={folderObject.name}
          onEdit={handleEdit}
          id={folderObject.id}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onCloseModal={handleCloseDeleteModal}
          name={folderObject.name}
          onDelete={handleDelete}
          type="dossier"
          id={folderObject.id}
        />
      )}
      {showModal && <FolderModal onCloseModal={handleCloseModal} onTrigger={handleTrigger} />}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="font-bold text-2xl">Mes Dossiers</h2>
          <p className="text-gray-secondary">Organiser vos documents par dossier</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex gap-2 bg-blue-400 py-2 rounded-lg hover:bg-blue-500
          text-white px-4 items-center cursor-pointer"
        >
          <Plus />
          Nouveau dossier
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-8">
        {folders.map((folder, idx: number) => (
          <FolderItem folder={folder} handleSelectFolder={handleSelectFolder} key={idx} />
        ))}
      </div>
    </>
  )
}
