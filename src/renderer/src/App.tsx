import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <h1>Home</h1>
      },
      {
        path: 'documents',
        element: <h1>Documents</h1>
      },
      {
        path: 'folders',
        element: <h1>Folders</h1>
      },
      {
        path: 'search',
        element: <h1>Search</h1>
      }
    ]
  }
])

function App(): React.JSX.Element {
  return <RouterProvider router={router} />
}

export default App
