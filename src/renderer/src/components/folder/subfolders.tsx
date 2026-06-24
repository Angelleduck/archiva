import { CirclePlus } from 'lucide-react'

import type { Folder, Folder as FolderType } from 'src/main/services/folder/folder.type'
import { DeleteModal } from './modal/delete'
import { useCallback, useState } from 'react'
import { EditTitleModal } from './modal/edit-title'
import { FolderCard } from '../subfolder/folder-card'
import { useNavigate } from 'react-router-dom'
import { Paginate } from '../paginate'

interface SubfoldersProps {
  subfolders: FolderType[]
  handleSetShowFolderModal: () => void
  setSubfolders: React.Dispatch<React.SetStateAction<FolderType[]>>
  page: number
  totalPages: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  handlePageUpdate: (arg: number) => void
  refetch: () => void
}

export function Subfolders({
  subfolders,
  handleSetShowFolderModal,
  setSubfolders,
  page,
  totalPages,
  handlePageUpdate,
  refetch,
  setPage
}: SubfoldersProps): React.JSX.Element {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditTitleModal, setShowEditTitleModal] = useState(false)
  const [folder, setfolder] = useState<Folder | null>(null)

  const handleSelectFolder = useCallback((folder: Folder, purpose: 'delete' | 'edit'): void => {
    setfolder(folder)
    if (purpose === 'delete') {
      setShowDeleteModal(true)
    } else {
      setShowEditTitleModal(true)
    }
  }, [])

  const handleEdit = async (folder: Folder | null, title: string): Promise<void> => {
    if (!folder) return
    const result = await window.api.folder.editFolderTitle(folder, title)
    if (result.success) {
      setSubfolders((prev) =>
        prev.map((currFolder) =>
          currFolder.id === folder.id ? { ...currFolder, name: title } : folder
        )
      )
    }

    handleCloseEditTitleModal()
  }

  const handleDeleteFolder = async (folder: Folder | null): Promise<void> => {
    if (!folder) return
    await window.api.folder.delete(folder)

    if (subfolders.length === 1 && page > 1) {
      setPage((page) => page - 1)
    } else {
      refetch()
    }

    handleCloseDeleteModal()
  }
  const handleCloseEditTitleModal = (): void => {
    setShowEditTitleModal(false)
  }
  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

  const navigate = useNavigate()

  const handleNavigate = useCallback(
    (id: number) => {
      navigate(`/folders/${id}`)
    },
    [navigate]
  )

  return (
    <>
      {showEditTitleModal && (
        <EditTitleModal
          onCloseModal={handleCloseEditTitleModal}
          onEdit={handleEdit}
          folder={folder}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onCloseModal={handleCloseDeleteModal}
          onDelete={handleDeleteFolder}
          folder={folder}
        />
      )}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-x-6 gap-y-6 mb-4">
          <div
            onClick={handleSetShowFolderModal}
            className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md 
           cursor-pointer transition-all duration-200 flex items-center justify-center"
          >
            <div className="flex flex-col gap-1 items-center">
              <CirclePlus size={56} className="text-blue-400" />
              <p>Nouveau dossier</p>
            </div>
          </div>
          {subfolders.map((folder) => (
            <FolderCard
              folder={folder}
              handleSelectFolder={handleSelectFolder}
              onNavigate={handleNavigate}
              key={folder.id}
            />
          ))}
        </div>
        <Paginate onPageUpdate={handlePageUpdate} page={page} totalPages={totalPages} />
      </div>
    </>
  )
}
