import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registerr from './pages/Registerr';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ProtectedRoute from './pages/ProtectedRoute';
import PostFetch from './pages/PostFetch';
import Network from './pages/Network';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define independent routes */}
        <Route path='/' element={
          <ProtectedRoute>
          <Home/>
          </ProtectedRoute>
          }/>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registerr />} />
        <Route path='/allPost' element={<PostFetch/>}/>
        <Route path='/network' element={
          <ProtectedRoute>
          <Network/>
          </ProtectedRoute>}
          />
        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
