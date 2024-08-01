import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/Home';
import WineDetails from './components/WineDetails';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wine/:id" element={<WineDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
