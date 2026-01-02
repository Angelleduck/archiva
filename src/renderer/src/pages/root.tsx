import { Sidebar } from '@renderer/components/sidebar'
import { Outlet } from 'react-router-dom'

export default function RootLayout(): React.JSX.Element {
  return (
    <>
      <Sidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </>
  )
}
