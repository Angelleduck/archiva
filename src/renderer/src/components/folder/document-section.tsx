import { formatSize } from '@renderer/helper/utils'
import { File, X } from 'lucide-react'

import type { FolderDocuments as FolderDocumentsType } from 'src/main/services/folder/folder.type'
import { Glass } from '../svg/glass'
import { useFolderSearch } from '@renderer/hooks/useFolderSearch'

interface DocumentSectionProps {
  folderDocuments: FolderDocumentsType[]
  handleOpenDocument: (path: string) => Promise<void>
  handleRemoveDocument: (folderId: string | undefined, documentId: string) => Promise<void>
  folderId: string | undefined
}

export function DocumentSection({
  folderDocuments,
  handleOpenDocument,
  handleRemoveDocument,
  folderId
}: DocumentSectionProps): React.JSX.Element {
  const { filteredSubfolders, debouncedSetSearchTerm } = useFolderSearch(folderDocuments)
  return (
    <div
      className="p-5 border border-border-primary rounded-lg bg-white
         transition-all duration-200 relative"
    >
      <h3 className="mb-4">Documents({folderDocuments.length})</h3>

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

      <div className="space-y-4 max-h-128 overflow-y-auto">
        {filteredSubfolders.map((doc, idx) => (
          <div
            key={idx}
            onClick={() => {
              handleOpenDocument(doc.path)
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
                  <p className="text-sm font-medium">{doc.filename}</p>
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
                  className="text-secondary hover:text-red-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
