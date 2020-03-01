import React, {useState} from 'react';
import './App.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BeerSearcher from "./component/input/beer-searcher/BeerSearcher";
import CalculationItem from "./flows/multicompare/CalculationItem";
import {Button, Col, Row} from "reactstrap";
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
