import { createHashRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/root'
import Home from './pages/home'
import Import from './pages/import'
import Folders from './pages/folders'
import Folder from './pages/folder'
import Document from './pages/document'
import { Toaster } from 'react-hot-toast'

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'import',
        element: <Import />
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
      }
    ]
  }
])

function App(): React.JSX.Element {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  )
}

export default App
