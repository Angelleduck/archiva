import { FolderModal } from '@renderer/components/folder/modal/add-folder'
import { DeleteModal } from '@renderer/components/folder/modal/delete'
import { EditTitleModal } from '@renderer/components/folder/modal/edit-title'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Folder } from 'src/main/services/folder/folder.type'
import { FolderItem } from '@renderer/components/folder/folder-item'
import Loader from '@renderer/components/document/loader'
import { Paginate } from '@renderer/components/document/paginate'
import { Glass } from '@renderer/components/svg/glass'

export default function Folders(): React.JSX.Element {
  const [folders, setFolders] = useState<Folder[]>([])
  const [showModal, setShowModal] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEdidtTitleModal, setShowEditTileModal] = useState(false)
  const [folderObject, setfolderObject] = useState({ name: '', id: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    function sleep(): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, 150))
    }

    async function getFolders(): Promise<void> {
      // Wait for both the fetch and the minimum delay
      const [result, allPages] = await Promise.all([
        window.api.folder.getRootFolders(page, searchTerm),
        window.api.folder.getFolderCount(searchTerm),
        sleep()
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

  const handleDelete = async (id: number): Promise<void> => {
    await window.api.folder.delete(id)

    if (folders.length === 1 && page > 1) {
      setPage((page) => page - 1)
    } else {
      setTrigger((prev) => prev + 1)
    }

    handleCloseDeleteModal()
  }

  const handleEdit = async (id: number, title: string): Promise<void> => {
    const result = await window.api.folder.editFolderTitle(id, title)
    if (result.success) {
      setFolders((prev) =>
        prev.map((folder) => (folder.id === id ? { ...folder, name: title } : folder))
      )
    }
    handleCloseEditTitleModal()
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

  const handlePageUpdate = (selectedPage: number): void => {
    setPage(selectedPage)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setPage(1)
    handleTrigger()
  }

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
          {folders.map((folder, idx: number) => (
            <FolderItem folder={folder} handleSelectFolder={handleSelectFolder} key={idx} />
          ))}
        </div>
        <Paginate onPageUpdate={handlePageUpdate} page={page} totalPages={totalPages} />
      </div>
    </>
  )
}
