import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/Home';
// import WineDetails from './components/WineDetails';
import LoginProvider from './context/LoginProvider';
import Login from './pages/page-authentification/Login';
import Register from './pages/page-authentification/register';
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
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={<ProtectedRoute element={<Home />} />}
            />
            {/* <Route
              element={<ProtectedRoute element={<WineDetails />} />}
              path="/Wine/:id"
            /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
};

export default App;
