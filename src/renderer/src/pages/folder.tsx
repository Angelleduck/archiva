import { File, FolderIcon, Plus, Trash2 } from 'lucide-react'

export default function Folder(): React.JSX.Element {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="font-bold text-2xl">Mes Dossiers</h2>
          <p className="text-secondary">Organisez vos documents par dossier</p>
        </div>
        <button className="flex gap-2 bg-blue-400 py-2 rounded-lg text-white px-4 items-center cursor-pointer">
          <Plus />
          Nouveau dossier
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-8">
        <div
          className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md
         cursor-pointer transition-all duration-200 relative"
        >
          <Trash2 size={20} className="absolute right-6 top-6 text-secondary hover:text-red-400" />
          <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md mb-5">
            <FolderIcon size={20} className="fill-blue-600 stroke-blue-600" />
          </div>
          <p className="font-semibold mb-2 text-primary">folder_name</p>
          <p className="flex gap-2 items-center text-sm">
            <File size={14} />2 document(s)
          </p>
        </div>
      </div>
    </>
  )
}
