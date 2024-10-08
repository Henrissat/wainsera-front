import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/Home';
import Wine from './pages/Wine';
import LoginProvider from './context/LoginProvider';
import './App.css';
import Login from './pages/page-authentification/Login';
import Register from './pages/page-authentification/register';

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
            <Route element={<Login />}  path="/Login" />
            <Route element={<Register />}  path="/Register" />
            <Route
              element={<ProtectedRoute element={<Home />} />}
              path="/"
            />
            <Route
              element={<ProtectedRoute element={<Wine />} />}
              path="/Wine/:id"
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
};

export default App;
