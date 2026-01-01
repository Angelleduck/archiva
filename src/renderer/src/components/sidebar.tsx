import { FileText, Folder, House } from 'lucide-react'
import { Glass } from './svg/glass'
import { NavLink } from 'react-router-dom'

export function Sidebar(): React.JSX.Element {
  return (
    <div className="w-64 flex flex-col p-4 gap-4 border-r border-gray-200">
      <NavItem href="/">
        <House size={20} />
        Home
      </NavItem>
      <NavItem href="/documents">
        <FileText size={20} />
        Documents
      </NavItem>
      <NavItem href="/folders">
        <Folder size={20} />
        Folders
      </NavItem>
      <NavItem href="/search">
        <Glass className="size-5" />
        Search
      </NavItem>
    </div>
  )
}

interface NavItemProps {
  children: React.ReactNode
  href: string
}

function NavItem({ children, href }: NavItemProps): React.JSX.Element {
  return (
    <NavLink
      className="flex items-center gap-3 text-gray-500 rounded-md px-4 py-1.5 
      hover:bg-gray-100 hover:text-black hover:[&>svg]:text-blue-400 "
      to={href}
    >
      {children}
    </NavLink>
  )
}
