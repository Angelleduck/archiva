import { columns } from '@renderer/components/document/columns'
import { DataTable } from '@renderer/components/document/data-table'
// import { DeleteModal } from '@renderer/components/folder/modal/delete'
// import { EditTitleModal } from '@renderer/components/folder/modal/edit-title'
import { Paginate } from '@renderer/components/paginate'
import { Glass } from '@renderer/components/svg/glass'
import { useEffect, useRef, useState } from 'react'
import type { Document as DocumentType } from 'src/main/services/document/document.type'

export default function Document(): React.JSX.Element | null {
  const [documents, setDocuments] = useState<DocumentType[]>([])
  // const [showDeleteModal, setShowDeleteModal] = useState(false)
  // const [documentObject, setDocumentObject] = useState({ name: '', id: 0 })
  const [isLoading, setIsLoading] = useState(true)
  // const [showEdidtTitleModal, setShowEditTileModal] = useState(false)
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

  // const handleDeleteFile = async (id: number): Promise<void> => {
  //   // await window.api.document.delete(id)

  //   // if (documents.length === 1 && page > 1) {
  //   //   setPage((page) => page - 1)
  //   // } else {
  //   //   setTrigger((prev) => prev + 1)
  //   }

  //   handleCloseDeleteModal()
  // }

  // const handleCloseDeleteModal = (): void => {
  //   setShowDeleteModal(false)
  // }

  // const handleCloseEditTitleModal = (): void => {
  //   setShowEditTileModal(false)
  // }

  // const handleEdit = async (id: number, title: string): Promise<void> => {
  //   const result = await window.api.document.editDocumentTitle(id, title)

  //   if (result.success) {
  //     setDocuments((prev) =>
  //       prev.map((document) => (document.id === id ? { ...document, filename: title } : document))
  //     )
  //   }
  //   handleCloseEditTitleModal()
  // }

  const handlePageUpdate = (selectedPage: number): void => {
    setPage(selectedPage)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setPage(1)
    setTrigger((prev) => prev + 1)
  }

  const handleTrigger = (): void => {
    setTrigger((prev) => prev + 1)
  }

  if (isLoading) return null

  return (
    <>
      <div>
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

        <div className="container mx-auto py-3">
          <DataTable columns={columns} data={documents} onTrigger={handleTrigger} />
        </div>

        <Paginate onPageUpdate={handlePageUpdate} page={page} totalPages={totalPages} />
      </div>
    </>
  )
}
