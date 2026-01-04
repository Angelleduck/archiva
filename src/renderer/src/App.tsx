import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/root'
import Home from './pages/home'
import Document from './pages/document'
import Folder from './pages/folder'
import Search from './pages/search'

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
  return <RouterProvider router={router} />
}

export default App
