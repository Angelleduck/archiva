import { FolderModal } from '@renderer/components/folder/modal/add-folder'
import { DeleteModal } from '@renderer/components/folder/modal/delete'
import { FolderIcon, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder } from 'src/main/services/folder/folder.type'

export default function Folders(): React.JSX.Element {
  const [folders, setFolders] = useState<Folder[]>([])
  const [showModal, setShowModal] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [folderObject, setfolderObject] = useState({ name: '', id: 0 })

  const navigate = useNavigate()

  useEffect(() => {
    async function getFolders(): Promise<void> {
      const result = await window.api.folder.getRootFolders()
      console.log(result)
      if (result.success) {
        setFolders(result.data)
      }
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
    await window.api.folder.delete(id)
    setTrigger((prev) => prev + 1)
  }
  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }
  return (
    <>
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
          <p className="text-secondary">Organisez vos documents par dossier</p>
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
          <div
            onClick={() => navigate(`${folder.id}`)}
            key={idx}
            className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md
         cursor-pointer transition-all duration-200 relative"
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
            <p className="font-semibold mb-2 text-primary">{folder.name}</p>
          </div>
        ))}
      </div>
    </>
  )
}
