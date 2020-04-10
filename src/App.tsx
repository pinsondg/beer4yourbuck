import React, {useState} from 'react';
import './App.css';
import {BeerVenue} from "./model/BeerVenue";
import {BeerVenueContext, BeerVenueContextData} from "./context/BeerVenueContext";
import {MultiCompareFlow} from "./flows/multicompare/MultiCompareFlow";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {TopNavBar} from "./component/nav/TopNavBar";
import {HomePage} from "./flows/home/HomePage";
import {NearYouPage} from "./flows/near-you/NearYouPage";
import {MenuUpload} from "./flows/upload/MenuUpload";
import {Beer} from "./model/Beer";
import {CompareBeerContext, CompareBeerContextData} from "./context/CompareBeerContext";

function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");
    const [venue, setVenue] = useState<BeerVenue>();
    const [compareBeers, setCompareBeers] = useState<Beer[]>([]);
    const venueContext: BeerVenueContextData = {venue, setVenue};
    const compareBeerContext: CompareBeerContextData = {compareBeers, setCompareBeers};

  return (
      <BeerVenueContext.Provider value={venueContext}>
          <Router>
              <div className="App">
                      {/*<VenueLocationSelectorModal/>*/}
                      <header>
                          <TopNavBar/>
                      </header>
                      <div className={'content'}>
                          <Switch>
                              <Route exact path={'/'}>
                                <HomePage/>
                              </Route>
                              <CompareBeerContext.Provider value={compareBeerContext}>
                                  <Route path={'/upload'}>
                                      <MenuUpload/>
                                  </Route>
                                  <Route path={'/compare'}>
                                      <MultiCompareFlow/>
                                  </Route>
                                  <Route path={'/near'}>
                                      <NearYouPage/>
                                  </Route>
                              </CompareBeerContext.Provider>
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
