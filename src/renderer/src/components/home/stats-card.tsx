import { type LucideIcon, Cylinder, FileText, Folder } from 'lucide-react'

export function StatsCard(): React.JSX.Element {
  return (
    <div
      className="grid md:grid-cols-[repeat(2,minmax(0,250px))] 
    lg:grid-cols-[repeat(3,minmax(0,300px))] gap-6 mb-8"
    >
      <Card Icon={FileText} color="blue" label="Documents" />
      <Card Icon={Folder} color="green" label="Dossiers" />
      <Card Icon={Cylinder} color="purple" label="Espace utilisé" />
    </div>
  )
}

interface CardProps {
  Icon: LucideIcon
  color: 'purple' | 'blue' | 'green'
  label: string
}

function Card({ Icon, color, label }: CardProps): React.JSX.Element {
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
      <h1 className="mb-1.5 text-2xl font-bold">4</h1>
      <p className="text-sm">{label}</p>
    </div>
  )
}
