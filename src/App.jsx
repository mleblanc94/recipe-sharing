import React from 'react';
import 'tachyons';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import './App.css'

function App() {
  return (
      <div className="app-wrapper">
        <div className="flex-grow-1">
          <Header />
        </div>
        <Footer />
      </div>
  );
}

export default App;
