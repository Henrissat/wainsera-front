import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/Home';
import Login from './pages/page-authentification/Login';
import WineDetails from './components/WineDetails';
import LoginProvider from './context/LoginProvider';
import './App.css';


const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const user = JSON.parse(`${localStorage.getItem("userLog")}`);

  if (user && user.token) {
    return element;
  }

  return <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <div className="App">
      <LoginProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={<ProtectedRoute element={<Home />} />}
            />
            <Route
              path="/wine/:id"
              element={<ProtectedRoute element={<WineDetails />} />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
};

export default App;
