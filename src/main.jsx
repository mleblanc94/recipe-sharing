import ReactDOM from '' //ASK CHATGPT ABOUT THIS!!
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Profile from './pages/Profile.jsx';
import CreateRecipe from './pages/CreateRecipe.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup';
import Home from './pages/Home';
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      }, {
      path: '/signin',
      element: <Signin />
    }, {
      path: '/signup',
      element: <Signup />
    }, {
      path: '/profile',
      element: <Profile />
    }, {
      path: '/create-recipe',
      element: <CreateRecipe />
    }, {
      
    }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
