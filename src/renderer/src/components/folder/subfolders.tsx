import { CirclePlus } from 'lucide-react'

import type { Folder, Folder as FolderType } from 'src/main/services/folder/folder.type'
import { DeleteModal } from './modal/delete'
import { useCallback, useState } from 'react'
import { EditTitleModal } from './modal/edit-title'
import { FolderCard } from '../subfolder/folder-card'
import { useNavigate } from 'react-router-dom'

interface SubfoldersProps {
  subfolders: FolderType[]
  handleSetShowFolderModal: () => void
  setSubfolders: React.Dispatch<React.SetStateAction<FolderType[]>>
}

export function Subfolders({
  subfolders,
  handleSetShowFolderModal,
  setSubfolders
}: SubfoldersProps): React.JSX.Element {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEdidtTitleModal, setShowEditTitleModal] = useState(false)
  const [folderObject, setfolderObject] = useState({ name: '', id: 0 })

  const handleSelectFolder = useCallback((folder: Folder, purpose: 'delete' | 'edit'): void => {
    setfolderObject({ id: folder.id, name: folder.name })
    if (purpose === 'delete') {
      setShowDeleteModal(true)
    } else {
      setShowEditTitleModal(true)
    }
  }, [])

  const handleEdit = async (id: number, title: string): Promise<void> => {
    const result = await window.api.folder.editFolderTitle(id, title)
    if (result.success) {
      setSubfolders((prev) =>
        prev.map((folder) => (folder.id === id ? { ...folder, name: title } : folder))
      )
    }

    handleCloseEditTitleModal()
  }

  const handleDeleteFolder = async (id: number): Promise<void> => {
    await window.api.folder.delete(id)
    setSubfolders((prev) => prev.filter((subfolder) => subfolder.id !== id))
    handleCloseDeleteModal()
  }
  const handleCloseEditTitleModal = (): void => {
    setShowEditTitleModal(false)
  }
  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

  console.log('re-ren-suby')

  const navigate = useNavigate()

  const handleNavigate = useCallback(
    (id: number) => {
      navigate(`/folders/${id}`)
    },
    [navigate]
  )

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
          onDelete={handleDeleteFolder}
          type="dossier"
          id={folderObject.id}
        />
      )}
      <div className="grid grid-cols-4 gap-x-6 gap-y-6 mb-4">
        {subfolders.map((folder) => (
          <FolderCard
            folder={folder}
            handleSelectFolder={handleSelectFolder}
            onNavigate={handleNavigate}
            key={folder.id}
          />
        ))}
        <div
          onClick={handleSetShowFolderModal}
          className="p-5 border border-border-primary rounded-lg bg-white 
        hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center"
        >
          <div className="flex flex-col gap-1 items-center">
            <CirclePlus size={56} className="text-blue-400" />
            <p>Nouveau dossier</p>
          </div>
        </div>
      </div>
    </>
  )
}
