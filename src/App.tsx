import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/Home';
import WineDetails from './components/WineDetails';
import LoginProvider from './context/LoginProvider';
import './App.css';
import Login from './pages/page-authentification/Login';
import Register from './pages/page-authentification/Register';

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
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route
              path="/"
              element={<ProtectedRoute element={<Home />} />}
            />
            {/* <Route
              path="/Wine/:id"
              element={<ProtectedRoute element={<WineDetails />} />}
            /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
};

export default App;
