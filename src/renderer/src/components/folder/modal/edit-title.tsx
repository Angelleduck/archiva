import { useState } from 'react'
import type { Folder } from 'src/main/services/folder/folder.type'

interface EditTitleModalProps {
  onCloseModal: () => void
  onEdit: (folder: Folder | null, title: string) => Promise<void>
  folder: Folder | null
}

export function EditTitleModal({
  onCloseModal,
  onEdit,
  folder
}: EditTitleModalProps): React.JSX.Element {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    onEdit(folder, title)
  }
  return (
    <div className="inset-0 fixed bg-black/50 z-10 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="basis-md max-w-md bg-white p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2">Modifier</h3>
        <p>Modifier nom du dossier</p>
        <p className="font-bold truncate">{folder?.name}</p>
        <div className="px-3 border-2 border-border-primary rounded-lg bg-white relative flex items-center gap-3 focus-within:border-blue-300 mb-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Nouveau nom"
            className="w-full py-2"
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
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
      </form>
    </div>
  )
}
