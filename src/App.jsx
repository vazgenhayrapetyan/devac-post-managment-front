import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePosts';
import EditPost from './pages/EditPost';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/posts" element={<Posts />} />
        
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/edit/:id" element={<EditPost />} />


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
