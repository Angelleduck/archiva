import { formatSize } from '@renderer/helper/utils'
import { type LucideIcon, Cylinder, FileText, Folder } from 'lucide-react'
import { useEffect, useState } from 'react'

export function StatsCard(): React.JSX.Element {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalFolders: 0,
    storageUsed: 0
  })
  useEffect(() => {
    async function getStats(): Promise<void> {
      const data = await window.api.document.stats()
      setStats({
        totalDocuments: data.total_file,
        totalFolders: data.total_folder,
        storageUsed: data.total_size
      })
    }
    getStats()
  }, [])
  return (
    <div
      className="grid md:grid-cols-[repeat(2,minmax(0,250px))] 
    lg:grid-cols-[repeat(3,minmax(0,300px))] gap-6 mb-8"
    >
      <Card Icon={FileText} color="blue" label="Documents" total={stats.totalDocuments} />
      <Card Icon={Folder} color="green" label="Dossiers" total={stats.totalFolders} />
      <Card Icon={Cylinder} color="purple" label="Espace utilisé" total={stats.storageUsed} />
    </div>
  )
}

interface CardProps {
  Icon: LucideIcon
  color: 'purple' | 'blue' | 'green'
  label: string
  total: number
}

function Card({ Icon, color, label, total }: CardProps): React.JSX.Element {
  const cardColor = {
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  }
  return (
    <div className="shadow-sm p-6 rounded-md bg-white">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center bg-linear-to-r ${cardColor[color]} shadow-sm mb-4`}
      >
        <Icon color="#fff" />
      </div>
      <h1 className="mb-1.5 text-2xl font-bold">
        {label !== 'Espace utilisé' ? total : formatSize(total)}
      </h1>
      <p className="text-sm">{label}</p>
    </div>
  )
}
