import React, {useEffect, useReducer, useState} from 'react';
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
import MobileNavBar from "./component/nav/MobileNavBar";
import MobileTopBar from "./component/nav/MobileTopBar";
// @ts-ignore
import AddToHomescreen from 'react-add-to-homescreen';
import {filterReducer, initialFilters, NearYouFilterContext} from "./context/NearYouFilterContext";
import {NearYouVenuesContext, NearYouVenuesContextAction, nearYouVenuesReducer} from "./context/NearYouVenuesContext";
import {useAsyncReducer} from "./controller/hooks/AsyncReducerHook";

const api = Beer4YourBuckAPI.getInstance();
function App() {
    const [filters, filterDispatch] = useReducer(filterReducer, initialFilters);
    const [nearYouVenues, nearYouVenuesDispatch] = useAsyncReducer<BeerVenue[] | null, NearYouVenuesContextAction>(nearYouVenuesReducer, {state: null});
    const [venue, setVenue] = useState<BeerVenue | null>();
    const [compareBeers, setCompareBeers] = useState<Beer[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const userContext: UserContext = {user, setUser};
    const venueContext: BeerVenueContextData = {venue, setVenue};
    const compareBeerContext: CompareBeerContextData = {compareBeers, setCompareBeers};
    const notificationContext: NotificationContext = {setNotifications, notifications};
    const [isMobileWidth, setIsMobileWidth] = useState<boolean>(window.innerWidth < 768);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setIsMobileWidth(window.innerWidth < 768);
        }, false);
    });

    useEffect(() => {
        if (!user) {
            api.getUserDetails().then(data => {
                if (JSON.stringify(user) !== data.data) {
                    setUser(data.data);
                }
            }).catch(err => {
                setUser(null);
            })
        }
    }, [user]);

    const onAddToHomescreenClick = () => {
        alert(`
            To add to your IPhone's homescreen:
            1. Make sure you are using Safari as your browser.
            2. Open Share menu.
            3. Click on add to homescreen option.
        `)
    };

  return (
      <BeerVenueContext.Provider value={venueContext}>
          <UserContext.Provider value={userContext}>
              <Router>
                  <div className="App">
                          <NotificationContext.Provider value={notificationContext}>
                              {!isMobileWidth && <TopNavBar/>}
                              {isMobileWidth && <MobileTopBar/>}
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
                                          <NearYouVenuesContext.Provider value={{nearYouVenues: nearYouVenues, nearYouVenueDispatch: nearYouVenuesDispatch}}>
                                              <NearYouFilterContext.Provider value={{filters: filters, filterDispatch: filterDispatch}}>
                                              <Route path={'/near'}>
                                                  <NearYouPage/>
                                              </Route>
                                              </NearYouFilterContext.Provider>
                                          </NearYouVenuesContext.Provider>
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
                              <div>
                                  <AddToHomescreen onAddToHomescreenClick={onAddToHomescreenClick} title={'Add to homescreen for a better user experience'}/>
                              </div>
                              {isMobileWidth && <MobileNavBar/>}
                          </NotificationContext.Provider>
                  </div>
              </Router>
          </UserContext.Provider>
      </BeerVenueContext.Provider>
  );
}

export default App;
