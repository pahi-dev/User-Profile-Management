import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfileView from './pages/ProfileView';
import ProfileEdit from './pages/ProfileEdit';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
