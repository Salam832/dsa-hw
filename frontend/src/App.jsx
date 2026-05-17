import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LibraryPage from "./pages/LibraryPage";
import ContentDetailsPage from "./pages/ContentDetailsPage";
import UploadPage from "./pages/UploadPage";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/library" element={<LibraryPage />} />

      <Route
        path="/content/:id"
        element={<ContentDetailsPage />}
      />

      <Route path="/upload" element={<UploadPage />} />

      <Route
        path="/admin"
        element={<h1>Admin Dashboard</h1>}
      />

      <Route path="/users" element={<UsersPage />} />
      
    </Routes>
  );
}

export default App;