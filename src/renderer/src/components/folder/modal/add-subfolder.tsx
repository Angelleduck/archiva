import type { FormEvent } from 'react'
import toast from 'react-hot-toast'

interface SubfolderModalProps {
  onCloseModal: () => void
  onTrigger: () => void
  parentId: string
}

export function SubfolderModal({
  onCloseModal,
  onTrigger,
  parentId
}: SubfolderModalProps): React.JSX.Element {
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const folderName = formData.get('name') as string
    if (folderName.length < 3) {
      toast.error('Nom trop court')
      return
    } else if (folderName.length > 15) {
      toast.error('Nom Trop long')
      return
    }
    window.api.folder.createSubfolder(Number(parentId), folderName)
    onTrigger()
    onCloseModal()
  }
  return (
    <div className="inset-0 fixed bg-black/50 z-10 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="basis-md bg-white p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-2">Nouveau dossier</h3>

        <div className="mb-4 space-y-2">
          <label className="block text-sm text-primary">Nom du dossier</label>
          <input
            id="name"
            name="name"
            autoFocus
            className="border-2 outline-none transition-all duration-300 border-border-primary
             focus:border-blue-300 w-full px-3 p-2.5 rounded-md"
            placeholder="Project 2025"
            type="text"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-300 hover:bg-blue-400 transition-colors
             flex-1 rounded-lg py-2 cursor-pointer text-white"
          >
            Creer
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
