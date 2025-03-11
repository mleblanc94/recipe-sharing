import { useState } from 'react'
import 'tachyons';
import Footer from './components/Footer';
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
