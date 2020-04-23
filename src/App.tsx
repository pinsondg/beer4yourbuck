import React, {useState} from 'react';
import './App.css';
import {BeerVenue} from "./model/BeerVenue";
import {BeerVenueContext, BeerVenueContextData} from "./context/BeerVenueContext";
import {MultiCompareFlow} from "./pages/multicompare/MultiCompareFlow";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {TopNavBar} from "./component/nav/TopNavBar";
import {HomePage} from "./pages/home/HomePage";
import {NearYouPage} from "./pages/near-you/NearYouPage";
import {MenuUpload} from "./pages/upload/MenuUpload";
import {Beer} from "./model/Beer";
import {CompareBeerContext, CompareBeerContextData} from "./context/CompareBeerContext";
import {Notification, NotificationContext} from "./context/NotificationContext";
import NotificationCenter from "./component/notification/NotificationCenter";
import CurrentVenue from "./pages/current-venue/CurrentVenue";
import {VenueLocationSelectorModal} from "./component/modal/VenueLocationSelectorModal";
import {UserContext} from "./context/UserContext";
import User from "./model/User";
import Login from "./pages/Login";
import Beer4YourBuckAPI from "./controller/api/Beer4YourBuckAPI";

const api = new Beer4YourBuckAPI();
function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");
    const [venue, setVenue] = useState<BeerVenue>();
    const [compareBeers, setCompareBeers] = useState<Beer[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [uploadNotificationShown, setUploadNotificationShown] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const userContext: UserContext = {user, setUser};
    const venueContext: BeerVenueContextData = {venue, setVenue};
    const compareBeerContext: CompareBeerContextData = {compareBeers, setCompareBeers};
    const notificationContext: NotificationContext = {setNotifications, notifications};

    if (!user) {
        api.getUserDetails().then(data => setUser(data.data))
    }

  return (
      <BeerVenueContext.Provider value={venueContext}>
          <UserContext.Provider value={userContext}>
              <Router>
                  <div className="App">
                          <VenueLocationSelectorModal/>
                          <header>
                              <TopNavBar/>
                          </header>
                          <div className={'content'}>
                              <NotificationContext.Provider value={notificationContext}>
                                  <NotificationCenter/>
                                  <Switch>
                                      <Route exact path={'/'}>
                                        <HomePage/>
                                      </Route>
                                      <CompareBeerContext.Provider value={compareBeerContext}>
                                          <Route path={'/upload'}>
                                              <MenuUpload/>
                                          </Route>
                                          <Route path={'/compare'}>
                                              <MultiCompareFlow uploadNotificationShown={[uploadNotificationShown, setUploadNotificationShown]}/>
                                          </Route>
                                          <Route path={'/near'}>
                                              <NearYouPage/>
                                          </Route>
                                          <Route path={'/current-venue'}>
                                              <CurrentVenue/>
                                          </Route>
                                          <Route exact path={'/login'}>
                                              <Login/>
                                          </Route>
                                      </CompareBeerContext.Provider>
                                  </Switch>
                              </NotificationContext.Provider>
                          </div>
                          <footer>
                              <a href={"https://github.com/pinsondg/beer4yourbuck"}>Contribute to this project</a>
                          </footer>
                  </div>
              </Router>
          </UserContext.Provider>
      </BeerVenueContext.Provider>
  );
}

export default App;
