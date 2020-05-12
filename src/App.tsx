import React, {useEffect, useState} from 'react';
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
import {UserContext} from "./context/UserContext";
import User from "./model/User";
import Login from "./pages/login-page/Login";
import Beer4YourBuckAPI from "./controller/api/Beer4YourBuckAPI";
import Register from "./pages/registration-page/Register";
import PasswordReset from "./pages/password-reset/PasswordReset";

const api = Beer4YourBuckAPI.getInstance();
function App() {
    console.log("Running app in " + process.env.NODE_ENV + " environment.");
    const [venue, setVenue] = useState<BeerVenue | null>();
    const [compareBeers, setCompareBeers] = useState<Beer[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [uploadNotificationShown, setUploadNotificationShown] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const userContext: UserContext = {user, setUser};
    const venueContext: BeerVenueContextData = {venue, setVenue};
    const compareBeerContext: CompareBeerContextData = {compareBeers, setCompareBeers};
    const notificationContext: NotificationContext = {setNotifications, notifications};

    useEffect(() => {
        if (!user) {
            api.getUserDetails().then(data => {
                if (JSON.stringify(user) !== data.data) {
                    setUser(data.data);
                }
            })
        }
    }, [user]);

  return (
      <BeerVenueContext.Provider value={venueContext}>
          <UserContext.Provider value={userContext}>
              <Router>
                  <div className="App">
                          <NotificationContext.Provider value={notificationContext}>
                              <header>
                                  <TopNavBar/>
                              </header>
                              <div className={'content'}>
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
                                              <MultiCompareFlow/>
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
                                          <Route path={'/register'}>
                                              <Register/>
                                          </Route>
                                          <Route path={'/resetPassword'}>
                                              <PasswordReset/>
                                          </Route>
                                      </CompareBeerContext.Provider>
                                  </Switch>
                              </div>
                              <footer style={{backgroundColor: '#343a40'}}>
                                  <a href={"https://github.com/pinsondg/beer4yourbuck"}>Contribute to this project</a>
                              </footer>
                          </NotificationContext.Provider>
                  </div>
              </Router>
          </UserContext.Provider>
      </BeerVenueContext.Provider>
  );
}

export default App;
