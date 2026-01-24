import { Glass } from '@renderer/components/svg/glass'
import { debounce } from '@renderer/helper/utils'
import { FolderIcon, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { Document } from 'src/main/services/document/document.type'

interface DocumentModalProps {
  onCloseModal: () => void
  onTrigger: () => void
  onFilterDocuments: (value) => void
  documents: Document[]
  folderId: string | undefined
}

export function DocumentModal({
  onCloseModal,
  onTrigger,
  onFilterDocuments,
  documents,
  folderId
}: DocumentModalProps): React.JSX.Element {
  const handleAdddocument = async (documentId: string): Promise<void> => {
    await window.api.folder.addDocument(folderId, documentId)
    onTrigger()
    onCloseModal()
  }

  const handleSearch = (value: string): void => {
    const data = documents.filter((el) => el.filename.toLowerCase().includes(value))
    onFilterDocuments(data)
  }

  const debouncedHandleSearch = useMemo(() => debounce(handleSearch, 600), [])
  return (
    <div className="inset-0 fixed bg-black/50 z-10 flex justify-center items-center">
      <div className="basis-2xl bg-white p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2">Ajouter un document</h3>

        <div
          className="px-3 border-2 border-border-primary rounded-lg bg-white relative 
          flex items-center gap-3 focus-within:border-blue-300 mb-2"
        >
          <Glass className="w-5 h-5 text-gray-400" />
          <input
            onChange={(e) => debouncedHandleSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder="Rechercher par nom"
            className="w-full py-3"
          />
        </div>

        <div className="mb-4 space-y-2 max-h-100 overflow-y-auto">
          {documents.length == 0 ? (
            <p className="text-center text-secondary my-12">
              Tous vos documents sont déjà dans ce dossier
            </p>
          ) : (
            documents.map((doc, idx) => (
              <div
                onClick={() => handleAdddocument(doc.id)}
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg 
              hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex gap-2 w-full">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md gap-2">
                    <FolderIcon size={20} className="fill-blue-600 stroke-blue-600 shrink-0" />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{doc.filename}</p>
                      <p className="text-xs">
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Plus className="text-blue-300" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onCloseModal}
          className="flex-1 border-2 border-border-primary w-full 
          hover:bg-gray-50 transition-colors rounded-lg py-2 cursor-pointer"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
