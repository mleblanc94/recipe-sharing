import ReactDOM from '' //ASK CHATGPT ABOUT THIS!!
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Profile from './pages/Profile.jsx';
import createRecipe from './pages/CreateRecipe.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
