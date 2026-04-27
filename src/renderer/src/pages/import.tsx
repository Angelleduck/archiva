import { DeleteModal } from '@renderer/components/folder/modal/delete'
import { formatSize } from '@renderer/helper/utils'
import { Download, File, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Document as DocumentType, SelectedFiles } from 'src/main/services/document/document.type'

export default function Import(): React.JSX.Element {
  const [documents, setDocuments] = useState<SelectedFiles[]>([])
  const [files, setFiles] = useState<DocumentType[]>([])
  const [trigger, setTrigger] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentObject, setDocumentObject] = useState({ name: '', id: 0 })

  useEffect(() => {
    async function getDocument(): Promise<void> {
      const result = await window.api.document.getRecent()
      if (result.success === true) {
        setFiles(result.data)
      }
    }
    getDocument()
  }, [trigger])

  async function handleSelectFile(): Promise<void> {
    const result = await window.api.document.selectFile()

    if (result.success === true) {
      setDocuments(result.data)
    }
  }

  async function handleImport(): Promise<void> {
    if (documents.length === 0) {
      return
    }

    await window.api.document.importFile(documents)

    setDocuments([])
    setTrigger((prev) => prev + 1)
  }
  const handleRemoveSelectedDocument = (idx: number): void => {
    setDocuments((files) => files.filter((_, index) => idx !== index))
  }
  const handleOpenDocument = async (filePath: string): Promise<void> => {
    const result = await window.api.document.open(filePath)
    if (result.success === false && result.message) {
      toast.error(result.message)
    }
  }

  const handleDeleteFile = async (id: number): Promise<void> => {
    const result = await window.api.document.delete(id)

    if (result.success) {
      setFiles((prev) => prev.filter((doc) => doc.id !== id))
    }
    setTrigger((prev) => prev + 1)
    handleCloseDeleteModal()
  }

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

  const handleDeleteClick = useCallback((docInfo: { id: number; name: string }) => {
    setDocumentObject(docInfo)
    setShowDeleteModal(true)
  }, [])

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onCloseModal={handleCloseDeleteModal}
          name={documentObject.name}
          id={documentObject.id}
          type="document"
          onDelete={handleDeleteFile}
        />
      )}
      <div className="space-y-4">
        <div className="p-6 rounded-lg bg-white border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Importer des documents</h3>
          <div className="space-y-6">
            <button
              type="button"
              className="flex py-4 w-full justify-center items-center border-2 border-blue-300
         rounded-lg font-semibold text-blue-300 gap-2 cursor-pointer"
              onClick={handleSelectFile}
            >
              <Download size={24} />
              Sélectionner des fichiers
            </button>

            {documents.length > 0 && (
              <>
                <h3 className="text-gray-secondary mb-1">
                  {documents.length} fichier(s) sélectionné(s):
                </h3>

                <div className="space-y-2">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <p className="py-0.5 px-2 text-white bg-blue-400 rounded-xl">
                        {doc.filename}
                      </p>
                      <X
                        onClick={() => handleRemoveSelectedDocument(idx)}
                        className="text-red-400 hover:text-red-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              className={`w-full text-white bg-blue-400 hover:bg-blue-500 py-3 rounded-lg
            ${documents.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={handleImport}
            >
              Importer les documents
            </button>
          </div>
        </div>
        <div className="py-2 rounded-lg bg-white border border-gray-200 ">
          <div className="p-2.5">
            <h2 className="text-xl font-bold">Récemment ajouté</h2>
          </div>
          <div>
            {files.map((doc, idx) => (
              <div key={idx} className="py-3 px-2.5 border-t border-border-primary">
                <div className="flex gap-4 ">
                  <File size={32} className="shrink-0" />
                  <div className="flex justify-between gap-2 items-center w-full">
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          handleOpenDocument(doc.path)
                        }}
                        className="font-semibold text-black-primary cursor-pointer hover:text-blue-300 leading-tight"
                      >
                        {doc.filename}
                      </button>
                      <div className="text-sm text-gray-secondary">
                        <span>{formatSize(doc.size)}</span>
                      </div>
                    </div>
                    <div
                      className="p-2 hover:bg-red-50 text-red-400 rounded-lg cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick({ id: doc.id, name: doc.filename })
                      }}
                    >
                      <Trash2 className="shrink-0" />
                    </div>
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
