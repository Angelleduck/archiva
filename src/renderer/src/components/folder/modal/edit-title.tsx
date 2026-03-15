import { useState } from 'react'

interface EditTitleModalProps {
  onCloseModal: () => void
  name: string
  onEdit: (id: number, title: string) => Promise<void>
  id: number
}

export function EditTitleModal({
  onCloseModal,
  name,
  onEdit,
  id
}: EditTitleModalProps): React.JSX.Element {
  const [title, setTitle] = useState('')
  return (
    <div className="inset-0 fixed bg-black/50 z-10 flex justify-center items-center">
      <div className="basis-md bg-white p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2">Modifier</h3>
        <p>
          Modifier nom du dossier <span className="font-bold">{name}</span>
        </p>
        <div className="px-3 border-2 border-border-primary rounded-lg bg-white relative flex items-center gap-3 focus-within:border-blue-300 mb-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Nouveau nom"
            className="w-full py-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onEdit(id, title)
            }}
            className="bg-blue-400 hover:bg-blue-500 transition-colors
             flex-1 rounded-lg py-2 cursor-pointer text-white"
          >
            Modifier
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
