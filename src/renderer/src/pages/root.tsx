import { Sidebar } from '@renderer/components/sidebar'
import { Outlet } from 'react-router-dom'

export default function RootLayout(): React.JSX.Element {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8 bg-main-bg">
        <Outlet />
      </main>
    </>
  )
}
