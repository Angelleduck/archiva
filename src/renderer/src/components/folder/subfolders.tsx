import { CirclePlus, FolderIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { Folder, Folder as FolderType } from 'src/main/services/folder/folder.type'
import { DeleteModal } from './modal/delete'
import { useState } from 'react'
import { Menu } from '../menu'
import { EditTitleModal } from './modal/edit-title'

interface SubfoldersProps {
  subfolders: FolderType[]
  handleSetShowFolderModal: () => void
  handleTrigger: () => void
}

export function Subfolders({
  subfolders,
  handleSetShowFolderModal,
  handleTrigger
}: SubfoldersProps): React.JSX.Element {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEdidtTitleModal, setShowEditTitleModal] = useState(false)
  const [folderObject, setfolderObject] = useState({ name: '', id: 0 })

  const handleSelectFolder = (folder: Folder, purpose: 'delete' | 'edit'): void => {
    setfolderObject({ id: folder.id, name: folder.name })
    if (purpose == 'delete') {
      setShowDeleteModal(true)
    } else {
      setShowEditTitleModal(true)
    }
  }

  const handleEdit = async (id: number, title: string): Promise<void> => {
    await window.api.folder.editFolderTitle(id, title)
    handleCloseEditTitleModal()
    handleTrigger()
  }

  const handleDeleteFolder = async (id: number): Promise<void> => {
    await window.api.folder.delete(id)
    handleCloseDeleteModal()
    handleTrigger()
  }
  const handleCloseEditTitleModal = (): void => {
    setShowEditTitleModal(false)
  }
  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

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
          <div
            onClick={() => navigate(`/folders/${folder.id}`)}
            key={folder.id}
            className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md cursor-pointer transition-all duration-200 relative"
          >
            <Menu onSelectFolder={handleSelectFolder} folder={folder} />
            <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md mb-5">
              <FolderIcon size={20} className="fill-blue-600 stroke-blue-600" />
            </div>
            <p className="font-semibold mb-1 text-black-primary truncate">{folder.name}</p>
            <p className="text-xs flex gap-1">
              <span>{new Date(folder.created_at).toLocaleDateString('fr-FR')}</span>
            </p>
          </div>
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
