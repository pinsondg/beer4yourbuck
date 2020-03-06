import React, {useState} from 'react';
import './App.css';
import {MultiComparePage} from "./flows/multicompare/MultiComparePage";
import {BeerVenue} from "./model/BeerVenue";
import {BeerVenueContext, BeerVenueContextData} from "./context/BeerVenueContext";
import {VenueLocationSelectorModal} from "./component/modal/VenueLocationSelectorModal";


function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");
    const [venue, setVenue] = useState<BeerVenue>();
    const context: BeerVenueContextData = {venue, setVenue};

  return (
    <div className="App">
        <BeerVenueContext.Provider value={context}>
            <VenueLocationSelectorModal/>
            <header>
                <h1>Beer 4 Your Buck</h1>
            </header>
            <MultiComparePage/>
            <footer>
                <a href={"https://github.com/pinsondg/beer4yourbuck"}>Contribute to this project</a>
            </footer>
        </BeerVenueContext.Provider>
    </div>
  );
}

export default App;
