import { CirclePlus, FolderIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { Folder as FolderType } from 'src/main/services/folder/folder.type'
import { DeleteModal } from './modal/delete'
import { useState } from 'react'

interface SubfoldersProps {
  subfolders: FolderType[]
  handleDeleteFolder: (id: number) => Promise<void>
  handleSetShowFolderModal: () => void
}

export function Subfolders({
  subfolders,
  handleDeleteFolder,
  handleSetShowFolderModal
}: SubfoldersProps): React.JSX.Element {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [folderObject, setfolderObject] = useState({ name: '', id: 0 })

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }
  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onCloseModal={handleCloseDeleteModal}
          name={folderObject.name}
          onDelete={handleDeleteFolder}
          type="dossier"
          id={folderObject.id}
        />
      )}
      <div className="grid grid-cols-4 gap-x-6 gap-y-6">
        {subfolders.map((folder) => (
          <div
            onClick={() => navigate(`/folders/${folder.id}`)}
            key={folder.id}
            className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md cursor-pointer transition-all duration-200 relative"
          >
            <Trash2
              onClick={(e) => {
                e.stopPropagation()
                setfolderObject({ id: folder.id, name: folder.name })
                setShowDeleteModal(true)
              }}
              size={20}
              className="absolute right-6 top-6 text-secondary hover:text-red-400"
            />
            <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md mb-5">
              <FolderIcon size={20} className="fill-blue-600 stroke-blue-600" />
            </div>
            <p className="font-semibold mb-1 text-primary truncate">{folder.name}</p>
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
