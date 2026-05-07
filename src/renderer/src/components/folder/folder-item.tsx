import { FolderIcon } from 'lucide-react'
import { FolderMenu } from './menu'
import { useNavigate } from 'react-router-dom'
import { Folder } from 'src/main/services/folder/folder.type'
import { memo } from 'react'

interface FolderItemProps {
  folder: Folder
  handleSelectFolder: (folder: Folder, purpose: 'delete' | 'edit') => void
}

const FolderItem = memo(function FolderItem({
  folder,
  handleSelectFolder
}: FolderItemProps): React.JSX.Element {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`${folder.id}`)}
      className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md
            cursor-pointer transition-all duration-200 relative"
    >
      <FolderMenu onSelectFolder={handleSelectFolder} folder={folder} />
      <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md mb-5">
        <FolderIcon size={20} className="fill-blue-600 stroke-blue-600" />
      </div>
      <p className="font-semibold mb-1 text-black-primary truncate">{folder.name}</p>
      <p className="text-xs">{new Date(folder.created_at).toLocaleDateString('fr-FR')}</p>
    </div>
  )
})

export { FolderItem }
