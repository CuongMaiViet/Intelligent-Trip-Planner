import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Pages from './components/Pages';
import { DataProvider } from './GlobalState'

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Pages />
        </div>
      </Router>
    </DataProvider>


  );
}

export default App;
