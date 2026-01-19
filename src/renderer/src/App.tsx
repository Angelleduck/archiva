import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/root'
import Home from './pages/home'
import Document from './pages/document'
import Folders from './pages/folders'
import Search from './pages/search'
import { Toaster } from 'sonner'
import Folder from './pages/folder'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'documents',
        element: <Document />
      },
      {
        path: 'folders',
        element: <Folders />
      },
      {
        path: 'folders/:id',
        element: <Folder />
      },
      {
        path: 'search',
        element: <Search />
      }
    ]
  }
])

function App(): React.JSX.Element {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
