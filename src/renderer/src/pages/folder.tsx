import { DocumentModal } from '@renderer/components/folder/modal/add-document'
import { ChevronLeft, FolderIcon, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Folder(): React.JSX.Element {
  const [folderDocuments, setFolderDocuments] = useState([])
  const [documentsNotInFolder, setDocumentsNotInFolder] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    async function getFolderDocuments(id: string): Promise<void> {
      const data = await window.api.folder.getDocuments(id)
      const allDocuments = await window.api.document.getAll()

      console.log(data)
      setFolderDocuments(data)

      const result = allDocuments.filter((doc) => !data.find((fd) => fd.id === doc.id))

      setDocumentsNotInFolder(result)
    }
    getFolderDocuments(id)
  }, [id, trigger])

  const handleCloseModal = (): void => {
    setShowModal(false)
  }
  const handleTrigger = (): void => {
    setTrigger((prev) => prev + 1)
  }

  const handleOpenDocument = async (filePath: string): Promise<void> => {
    await window.api.document.open(filePath)
  }

  const handleRemoveDocument = async (folderId: string, documentId: string): Promise<void> => {
    await window.api.folder.removeDocument(folderId, documentId)
    handleTrigger()
  }
  return (
    <>
      {showModal && (
        <DocumentModal
          onCloseModal={handleCloseModal}
          folderId={id}
          documents={documentsNotInFolder}
          onTrigger={handleTrigger}
        />
      )}
      <div className="space-y-4">
        <div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate('/folders')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft />
            </button>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2 items-center">
                <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md gap-2">
                  <FolderIcon size={20} className="fill-blue-600 stroke-blue-600 shrink-0" />
                </div>
                <p>Name</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex gap-2 bg-blue-400 py-2 rounded-lg text-white px-4 items-center cursor-pointer"
              >
                <Plus />
                Ajouter un document
              </button>
            </div>
          </div>
        </div>

        <div
          className="p-5 border border-border-primary rounded-lg bg-white
         transition-all duration-200 relative"
        >
          <h3 className="mb-6">Documents({folderDocuments.length})</h3>

          <div className="space-y-4">
            {folderDocuments.map((el, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleOpenDocument(el.path)
                }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg
                hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex gap-2 w-full">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md gap-2">
                    <FolderIcon size={20} className="fill-blue-600 stroke-blue-600 shrink-0" />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{el.filename}</p>
                      <p className="text-xs">
                        {new Date(el.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <X
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveDocument(id, el.id)
                      }}
                      className="text-secondary hover:text-red-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
