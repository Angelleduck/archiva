import Loader from '@renderer/components/document/loader'
import { DocumentSection } from '@renderer/components/folder/document-section'
import { DocumentModal } from '@renderer/components/folder/modal/add-document'
import { SubfolderModal } from '@renderer/components/folder/modal/add-subfolder'
import { Subfolders } from '@renderer/components/folder/subfolders'
import { Glass } from '@renderer/components/svg/glass'
import { useFolderData } from '@renderer/hooks/useFolderData'
import { useFolderSearch } from '@renderer/hooks/useFolderSearch'
import { ChevronLeft, FolderIcon, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Folder(): React.JSX.Element {
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()
  const { folderDocuments, folder, subfolders, refetch, isLoading, setSubfolders } =
    useFolderData(id)

  const { filteredSubfolders, debouncedSetSearchTerm } = useFolderSearch(subfolders)

  const handleCloseDocumentModal = (): void => {
    setShowDocumentModal(false)
  }
  const handleCloseFolderModal = (): void => {
    setShowFolderModal(false)
  }
  const handleTrigger = (): void => {
    refetch()
  }

  const handleRemoveDocument = async (
    folderId: string | undefined,
    documentId: string
  ): Promise<void> => {
    await window.api.folder.removeDocument(folderId, documentId)
    handleTrigger()
  }
  const handleSetShowFolderModal = useCallback((): void => {
    setShowFolderModal(true)
  }, [])

  if (isLoading) return <Loader />

  return (
    <>
      {showFolderModal && id && (
        <SubfolderModal
          onCloseModal={handleCloseFolderModal}
          onTrigger={handleTrigger}
          parentId={id}
        />
      )}
      {showDocumentModal && (
        <DocumentModal
          onCloseModal={handleCloseDocumentModal}
          folderId={id}
          folderDocuments={folderDocuments}
          onTrigger={handleTrigger}
        />
      )}
      <div>
        <div className="mb-4">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft />
            </button>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2 items-center">
                <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md gap-2">
                  <FolderIcon size={20} className="fill-blue-600 stroke-blue-600 shrink-0" />
                </div>
                <p>{folder?.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDocumentModal(true)}
                className="flex gap-2 bg-blue-400 py-2 rounded-lg hover:bg-blue-500
                text-white px-4 items-center cursor-pointer"
              >
                <Plus />
                Ajouter un document
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="px-3 border-2 border-border-primary rounded-lg bg-white relative flex items-center gap-3 focus-within:border-blue-300 mb-2">
            <Glass className="w-5 h-5 text-gray-400" />
            <input
              onChange={(e) => debouncedSetSearchTerm(e.target.value.toLowerCase())}
              type="text"
              placeholder="Rechercher par nom"
              className="w-full py-3"
            />
          </div>
        </div>

        <Subfolders
          subfolders={filteredSubfolders}
          handleSetShowFolderModal={handleSetShowFolderModal}
          setSubfolders={setSubfolders}
        />

        <DocumentSection
          folderDocuments={folderDocuments}
          folderId={id}
          handleRemoveDocument={handleRemoveDocument}
        />
      </div>
    </>
  )
}
