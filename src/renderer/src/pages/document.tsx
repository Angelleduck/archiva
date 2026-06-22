import { columns } from '@renderer/components/document/columns'
import { DataTable } from '@renderer/components/document/data-table'
import { DocumentMenu } from '@renderer/components/document/menu'
import { DeleteModal } from '@renderer/components/folder/modal/delete'
import { EditTitleModal } from '@renderer/components/folder/modal/edit-title'
import { Paginate } from '@renderer/components/paginate'
import { Glass } from '@renderer/components/svg/glass'
import { formatSize } from '@renderer/helper/utils'
import { File } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import type { Document, DocumentStatus } from 'src/main/services/document/document.type'

export default function Document(): React.JSX.Element | null {
  const [documents, setDocuments] = useState<Document[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentObject, setDocumentObject] = useState({ name: '', id: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showEdidtTitleModal, setShowEditTileModal] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const searchTerm = useRef('')

  useEffect(() => {
    async function getAlldocument(): Promise<void> {
      const [allDocument, allPages] = await Promise.all([
        window.api.document.getAll(page, searchTerm.current),
        window.api.document.getDocumentCount(searchTerm.current)
      ])
      if (allDocument.success) {
        setDocuments(allDocument.data)
      }

      if (allPages.success) {
        setTotalPages(Math.ceil(allPages.data / 20))
      }
      setIsLoading(false)
    }
    getAlldocument()
  }, [trigger, page])

  console.log(documents)

  const handleOpenDocument = async (filePath: string, status: DocumentStatus): Promise<void> => {
    const result = await window.api.document.open(filePath, status)
    if (result.success == false && result.message) {
      toast.error(result.message)
    }
  }

  const handleDeleteFile = async (id: number): Promise<void> => {
    await window.api.document.delete(id)

    if (documents.length === 1 && page > 1) {
      setPage((page) => page - 1)
    } else {
      setTrigger((prev) => prev + 1)
    }

    handleCloseDeleteModal()
  }

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false)
  }

  const handleDeleteClick = useCallback((docInfo: { id: number; name: string }) => {
    setDocumentObject(docInfo)
    setShowDeleteModal(true)
  }, [])

  const handleOpen = useCallback((path: string) => {
    handleOpenDocument(path, 'Already imported')
  }, [])

  const handleSelectDocument = useCallback((document: Document, purpose: 'delete' | 'edit') => {
    setDocumentObject({ id: document.id, name: document.filename })

    if (purpose === 'delete') {
      setShowDeleteModal(true)
    } else {
      setShowEditTileModal(true)
    }
  }, [])

  const handleCloseEditTitleModal = (): void => {
    setShowEditTileModal(false)
  }

  const handleEdit = async (id: number, title: string): Promise<void> => {
    const result = await window.api.document.editDocumentTitle(id, title)

    if (result.success) {
      setDocuments((prev) =>
        prev.map((document) => (document.id === id ? { ...document, filename: title } : document))
      )
    }
    handleCloseEditTitleModal()
  }

  const handlePageUpdate = (selectedPage: number): void => {
    setPage(selectedPage)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setPage(1)
    setTrigger((prev) => prev + 1)
  }

  if (isLoading) return null

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
      {showEdidtTitleModal && (
        <EditTitleModal
          onCloseModal={handleCloseEditTitleModal}
          name={documentObject.name}
          onEdit={handleEdit}
          id={documentObject.id}
          type="document"
        />
      )}

      {/* before */}
      {/* <div>
        <form
          onSubmit={handleSubmit}
          className="px-3 border-2 border-border-primary rounded-lg bg-white
        relative flex items-center gap-3 focus-within:border-blue-300 mb-2"
        >
          <Glass className="w-5 h-5 text-gray-400" />
          <input
            onChange={(e) => (searchTerm.current = e.target.value)}
            type="text"
            placeholder="Rechercher par nom"
            className="w-full py-3"
          />
        </form>

        <div className="grid grid-cols-4 gap-x-6 gap-y-8 mb-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onOpen={handleOpen}
              onDeleteClick={handleDeleteClick}
              handleSelectDocument={handleSelectDocument}
            />
          ))}
        </div>
        <Paginate onPageUpdate={handlePageUpdate} page={page} totalPages={totalPages} />
      </div> */}

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={documents} />
      </div>
    </>
  )
}

type Props = {
  doc: Document
  onOpen: (path: string) => void
  onDeleteClick: (doc: { id: number; name: string }) => void
  handleSelectDocument: (document: Document, purpose: 'delete' | 'edit') => void
}

const DocumentCard = memo(function DocumentCard({
  doc,
  onOpen,
  handleSelectDocument
}: Props): React.JSX.Element {
  return (
    <div
      onClick={() => onOpen(doc.path)}
      className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md
      cursor-pointer transition-all duration-200 relative"
    >
      <DocumentMenu onSelectDocument={handleSelectDocument} document={doc} />

      <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md mb-5">
        <File size={20} className="fill-blue-600 stroke-blue-600" />
      </div>

      <p className="font-semibold mb-1 text-black-primary truncate">{doc.filename}</p>

      <p className="text-xs flex gap-1">
        <span>{formatSize(doc.size)}</span>
        <span>•</span>
        <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
      </p>
    </div>
  )
})
