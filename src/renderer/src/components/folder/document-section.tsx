import { formatSize } from '@renderer/helper/utils'
import { File, Plus, X } from 'lucide-react'

import type { FolderDocuments as FolderDocumentsType } from 'src/main/services/folder/folder.type'
import { Glass } from '../svg/glass'
import { useDoucmentSearch } from '@renderer/hooks/useDocumentSearch'
import toast from 'react-hot-toast'
import type { DocumentStatus } from 'src/main/services/document/document.type'

interface DocumentSectionProps {
  folderDocuments: FolderDocumentsType[]
  handleRemoveDocument: (folderId: number, documentId: number) => Promise<void>
  folderId: number
  onOpenDocumentModal: () => void
}

export function DocumentSection({
  folderDocuments,
  handleRemoveDocument,
  folderId,
  onOpenDocumentModal
}: DocumentSectionProps): React.JSX.Element {
  const { filteredDocuments, debouncedSetSearchTerm } = useDoucmentSearch(folderDocuments)

  const handleOpenDocument = async (filePath: string, status: DocumentStatus): Promise<void> => {
    const result = await window.api.document.open(filePath, status)
    if (result.success === false && result.message) {
      toast.error(result.message)
    }
  }

  return (
    <div
      className="p-5 border border-border-primary rounded-lg bg-white
      transition-all duration-200 relative"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="">Documents({folderDocuments.length})</h3>
        <button
          type="button"
          onClick={onOpenDocumentModal}
          className="flex gap-2 bg-blue-400 py-2 rounded-lg hover:bg-blue-500
                text-white px-4 items-center cursor-pointer"
        >
          <Plus />
          Ajouter un document
        </button>
      </div>
      <div
        className="px-3 border-border-primary rounded-lg transition-all
      bg-white relative flex items-center gap-3 focus-within:border-blue-300
        border-2 mb-4"
      >
        <Glass className="w-5 h-5 text-gray-400" />
        <input
          onChange={(e) => debouncedSetSearchTerm(e.target.value.toLowerCase())}
          type="text"
          placeholder="Rechercher par nom"
          className="w-full py-3"
        />
      </div>

      <div className="space-y-4 max-h-128 overflow-y-auto pr-2.5">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => {
              handleOpenDocument(doc.path, 'Already imported')
            }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg
                hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex gap-2 w-full">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md gap-2">
                <File size={20} className="fill-blue-600 stroke-blue-600 shrink-0" />
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <p className="text-sm font-medium max-w-[80ch] truncate">{doc.filename}</p>
                  <p className="text-xs flex gap-1">
                    <span>{formatSize(doc.size)}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                  </p>
                </div>
                <X
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveDocument(folderId, doc.id)
                  }}
                  className="text-gray-secondary hover:text-red-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
