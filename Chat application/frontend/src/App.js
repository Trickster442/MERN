import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registerr from './pages/Registerr';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ProtectedRoute from './pages/ProtectedRoute';
import PostFetch from './pages/PostFetch';
import Network from './pages/Network';
import ReceiveRequest from './pages/ReceiveRequest';
import Message from './pages/Message';
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
        <Route path='/allPost' element={
          <ProtectedRoute>
            <PostFetch/>
            </ProtectedRoute>
          }/>
        <Route path="/friendRequest" element={
          <ProtectedRoute>
          <ReceiveRequest/>
          </ProtectedRoute>
          } />
        <Route path='/network' element={
          <ProtectedRoute>
          <Network/>
          </ProtectedRoute>}
          />

        <Route path='/messaging' element={
          <ProtectedRoute>
          <Message/>
          </ProtectedRoute>}
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
