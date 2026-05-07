import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import type { Folder } from 'src/main/services/folder/folder.type'

interface MenuProps {
  onSelectFolder: (folder: Folder, purpose: 'delete' | 'edit') => void
  folder: Folder
}

export function FolderMenu({ onSelectFolder, folder }: MenuProps): React.JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button className="hover:bg-[#e9e9e9] py-1 absolute right-6 top-6 rounded-sm cursor-pointer">
          <EllipsisVertical />
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-1" onClick={(e) => e.stopPropagation()} align="start">
        <div className="space-y-3">
          <button
            onClick={() => onSelectFolder(folder, 'edit')}
            className="flex gap-2 items-center cursor-pointer group 
          bg-gray-100 hover:bg-gray-200 w-full p-2 rounded-md"
          >
            <SquarePen className="text-gray-secondary group-hover:text-blue-400" size={22} />
            <p className="font-medium group-hover:text-blue-400">Modifier titre</p>
          </button>
          <button
            onClick={() => onSelectFolder(folder, 'delete')}
            className="flex gap-2 items-center cursor-pointer group 
          bg-gray-100 hover:bg-gray-200 w-full p-2 rounded-md"
          >
            <Trash2 className="text-gray-secondary group-hover:text-red-400" size={22} />
            <p className="font-medium group-hover:text-red-400">Supprimer dossier</p>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
