import React, {useState} from 'react';
import './App.css';
import {BeerVenue} from "./model/BeerVenue";
import {BeerVenueContext, BeerVenueContextData} from "./context/BeerVenueContext";
import {MultiCompareFlow} from "./flows/multicompare/MultiCompareFlow";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {TopNavBar} from "./component/nav/TopNavBar";
import {HomePage} from "./flows/home/HomePage";
import {MenuUpload} from "./flows/upload/MenuUpload";
import {NearYouPage} from "./flows/near-you/NearYouPage";


function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");
    const [venue, setVenue] = useState<BeerVenue>();
    const context: BeerVenueContextData = {venue, setVenue};

  return (
      <Router>
          <div className="App">
              <BeerVenueContext.Provider value={context}>
                  {/*<VenueLocationSelectorModal/>*/}
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
                          <Route path={'/upload'}>
                                <MenuUpload/>
                          </Route>
                          <Route path={'/near'}>
                            <NearYouPage/>
                          </Route>
                      </Switch>
                  </div>
                  <footer>
                      <a href={"https://github.com/pinsondg/beer4yourbuck"}>Contribute to this project</a>
                  </footer>
              </BeerVenueContext.Provider>
          </div>
      </Router>
  );
}

export default App;
