import { Document } from 'src/main/services/document/document.type'

interface DeleteModalProps {
  onCloseModal: () => void
  type: 'document' | 'dossier'
  onDelete: (doc: Document | undefined) => Promise<void>
  doc: Document | undefined
}

export function DeleteModal({
  onCloseModal,
  type,
  onDelete,
  doc
}: DeleteModalProps): React.JSX.Element {
  return (
    <div className="inset-0 fixed bg-black/50 z-10 flex justify-center items-center">
      <div className="basis-md max-w-md bg-white p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2">Supprimer {type}</h3>
        <p>Êtes-vous sûr de vouloir supprimer</p>
        <p className="font-semibold mb-2 truncate">{doc?.filename} ?</p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onDelete(doc)
            }}
            className="bg-red-500 hover:bg-red-600 transition-colors
             flex-1 rounded-lg py-2 cursor-pointer text-white"
          >
            Supprimer
          </button>
          <button
            type="button"
            onClick={onCloseModal}
            className="flex-1 border-2 border-border-primary 
          hover:bg-gray-50 transition-colors rounded-lg py-2 cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
