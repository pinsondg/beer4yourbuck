import React from 'react';
import './App.css';

import {MultiComparePage} from "./flows/multicompare/MultiComparePage";

function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");

  return (
    <div className="App">
        <header>
            <h1>Beer 4 Your Buck</h1>
        </header>
        <MultiComparePage/>
    </div>
  );
}

export default App;
