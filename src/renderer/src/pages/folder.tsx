import { DocumentSection } from '@renderer/components/folder/document-section'
import { DocumentModal } from '@renderer/components/folder/modal/add-document'
import { SubfolderModal } from '@renderer/components/folder/modal/add-subfolder'
import { Subfolders } from '@renderer/components/folder/subfolders'
import { Glass } from '@renderer/components/svg/glass'
import { useFolderData } from '@renderer/hooks/useFolderData'
import { ChevronLeft, FolderIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Folder(): React.JSX.Element | null {
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()

  const [searchTerm, setSearchTerm] = useState('')
  const {
    folderDocuments,
    folder,
    subfolders,
    refetch,
    isLoading,
    setSubfolders,
    page,
    totalPages,
    handlePageUpdate,
    setPage
  } = useFolderData(id, searchTerm)

  const handleCloseDocumentModal = (): void => {
    setShowDocumentModal(false)
  }
  const handleOpenDocumentModal = useCallback((): void => {
    setShowDocumentModal(true)
  }, [])
  const handleCloseFolderModal = (): void => {
    setShowFolderModal(false)
  }
  const handleTrigger = (): void => {
    refetch()
  }

  const handleRemoveDocument = async (folderId: number, documentId: number): Promise<void> => {
    await window.api.folder.removeDocument(folderId, documentId)
    handleTrigger()
  }
  const handleSetShowFolderModal = (): void => {
    setShowFolderModal(true)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setPage(1)
    refetch()
  }

  if (isLoading) return null

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
          folderId={Number(id)}
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
                <p className="max-w-[60ch] truncate">{folder?.name}</p>
              </div>
            </div>
          </div>
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

        <Subfolders
          subfolders={subfolders}
          handleSetShowFolderModal={handleSetShowFolderModal}
          setSubfolders={setSubfolders}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          handlePageUpdate={handlePageUpdate}
          refetch={refetch}
        />

        <DocumentSection
          folderDocuments={folderDocuments}
          folderId={Number(id)}
          handleRemoveDocument={handleRemoveDocument}
          onOpenDocumentModal={handleOpenDocumentModal}
        />
      </div>
    </>
  )
}
