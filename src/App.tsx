import React, {useState} from 'react';
import './App.css';
import {BeerVenue} from "./model/BeerVenue";
import {BeerVenueContext, BeerVenueContextData} from "./context/BeerVenueContext";
import {MultiCompareFlow} from "./flows/multicompare/MultiCompareFlow";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {TopNavBar} from "./component/nav/TopNavBar";
import {HomePage} from "./flows/home/HomePage";
import {NearYouPage} from "./flows/near-you/NearYouPage";
import {VenueLocationSelectorModal} from "./component/modal/VenueLocationSelectorModal";

function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");
    const [venue, setVenue] = useState<BeerVenue>();
    const context: BeerVenueContextData = {venue, setVenue};

  return (
      <BeerVenueContext.Provider value={context}>
          <Router>
              <div className="App">
                      <VenueLocationSelectorModal/>
                      <header>
                          <TopNavBar/>
                      </header>
                      <div className={'content'}>
                          <Switch>
                              <Route exact path={'/'}>
                                <HomePage/>
                              </Route>
                              <Route path={'/compare'}>
                                  <MultiCompareFlow/>
                              </Route>
                              <Route path={'/near'}>
                                <NearYouPage/>
                              </Route>
                          </Switch>
                      </div>
                      <footer>
                          <a href={"https://github.com/pinsondg/beer4yourbuck"}>Contribute to this project</a>
                      </footer>
              </div>
          </Router>
      </BeerVenueContext.Provider>
  );
}

export default App;
