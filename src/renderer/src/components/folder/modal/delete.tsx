interface DeleteModalProps {
  onCloseModal: () => void
  name: string
  type: 'document' | 'dossier'
  onDelete: (id: number) => Promise<void>
  id: number
}

export function DeleteModal({
  onCloseModal,
  name,
  type,
  onDelete,
  id
}: DeleteModalProps): React.JSX.Element {
  return (
    <div className="inset-0 fixed bg-black/50 z-10 flex justify-center items-center">
      <div className="basis-md bg-white p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2">Supprimer {type}</h3>
        <p>Êtes-vous sûr de vouloir supprimer</p>
        <p className="font-semibold mb-2">{name} ?</p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onDelete(id)
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
