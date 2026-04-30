import { memo } from 'react'
import { FolderMenu } from '../folder/menu'
import { FolderIcon } from 'lucide-react'
import { Folder } from 'src/main/services/folder/folder.type'
// import { useNavigate } from 'react-router-dom'

interface FolderCardProps {
  folder: Folder
  handleSelectFolder: (folder: Folder, purpose: 'delete' | 'edit') => void
  onNavigate: (id: number) => void
}

const FolderCard = memo(function FolderCard({
  folder,
  handleSelectFolder,
  onNavigate
}: FolderCardProps): React.JSX.Element {
  console.log('trigger folder card')
  return (
    <div
      onClick={() => onNavigate(folder.id)}
      key={folder.id}
      className="p-5 border border-border-primary rounded-lg bg-white hover:shadow-md cursor-pointer transition-all duration-200 relative"
    >
      <FolderMenu onSelectFolder={handleSelectFolder} folder={folder} />
      <div className="w-11 h-11 bg-blue-100 flex items-center justify-center rounded-md mb-5">
        <FolderIcon size={20} className="fill-blue-600 stroke-blue-600" />
      </div>
      <p className="font-semibold mb-1 text-black-primary truncate">{folder.name}</p>
      <p className="text-xs flex gap-1">
        <span>{new Date(folder.created_at).toLocaleDateString('fr-FR')}</span>
      </p>
    </div>
  )
})
export { FolderCard }
