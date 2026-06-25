import { FolderModal } from '@renderer/components/folder/modal/add-folder'
import { DeleteModal } from '@renderer/components/folder/modal/delete'
import { EditTitleModal } from '@renderer/components/folder/modal/edit-title'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Folder } from 'src/main/services/folder/folder.type'
import { FolderItem } from '@renderer/components/folder/folder-item'
import { Glass } from '@renderer/components/svg/glass'
import { Paginate } from '@renderer/components/paginate'

export default function Folders(): React.JSX.Element | null {
  const [folders, setFolders] = useState<Folder[]>([])
  const [showModal, setShowModal] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditTitleModal, setShowEditTitleModal] = useState(false)
  const [folder, setfolder] = useState<Folder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function getFolders(): Promise<void> {
      const [result, allPages] = await Promise.all([
        window.api.folder.getRootFolders(page, searchTerm),
        window.api.folder.getFolderCount(searchTerm)
      ])

      if (result.success) {
        setFolders(result.data)
      }

      if (allPages.success) {
        setTotalPages(Math.ceil(allPages.data / 16))
      }

      setIsLoading(false)
    }
    getFolders()
  }, [trigger, page])

  const handleCloseModal = (): void => {
    setShowModal(false)
  }

  const handleTrigger = (): void => {
    setTrigger((prev) => prev + 1)
  }

  const handleEdit = async (folder: Folder | null, title: string): Promise<void> => {
    if (!folder) return
    const result = await window.api.folder.editFolderTitle(folder, title)
    if (result.success) {
      setFolders((prev) =>
        prev.map((currFolder) =>
          currFolder.id === folder.id ? { ...currFolder, name: title } : currFolder
        )
      )
    }

    handleCloseEditTitleModal()
  }

  const handleDeleteFolder = async (folder: Folder | null): Promise<void> => {
    if (!folder) return
    await window.api.folder.delete(folder)

    if (folders.length === 1 && page > 1) {
      setPage((page) => page - 1)
    } else {
      setTrigger((prev) => prev + 1)
    }

    handleCloseDeleteModal()
  }
  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

  const handleCloseEditTitleModal = (): void => {
    setShowEditTitleModal(false)
  }

  const handleSelectFolder = (folder: Folder, purpose: 'delete' | 'edit'): void => {
    setfolder(folder)
    if (purpose === 'delete') {
      setShowDeleteModal(true)
    } else {
      setShowEditTitleModal(true)
    }
  }

  const handlePageUpdate = (selectedPage: number): void => {
    setPage(selectedPage)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setPage(1)
    handleTrigger()
  }

  if (isLoading) return null

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
      {showModal && <FolderModal onCloseModal={handleCloseModal} onTrigger={handleTrigger} />}

      <div>
        <div className="flex items-center justify-between mb-4">
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

        <div className="mb-4">
          <form
            onSubmit={handleSubmit}
            className="px-3 border-2 border-border-primary rounded-lg bg-white relative flex
            items-center gap-3 focus-within:border-blue-300 mb-2"
          >
            <Glass className="w-5 h-5 text-gray-400" />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Rechercher par nom"
              className="w-full py-3"
            />
          </form>
        </div>

        <div className="grid grid-cols-4 gap-x-6 gap-y-8 mb-4">
          {folders.map((folder) => (
            <FolderItem folder={folder} handleSelectFolder={handleSelectFolder} key={folder.id} />
          ))}
        </div>
        <Paginate onPageUpdate={handlePageUpdate} page={page} totalPages={totalPages} />
      </div>
    </>
  )
}
