import React, {useContext, useEffect, useState} from "react";
import './home-page.css'
import Background from '../../image/domain/stock/selective-focus-photography-of-people-having-a-toast-1269043.jpg'
import {GiGears} from "react-icons/gi";
import {IoIosArrowDown} from 'react-icons/io'
import {MdCompareArrows, MdMyLocation, MdNearMe} from 'react-icons/md'
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {UserContext} from "../../context/UserContext";
import {useHistory} from "react-router-dom";


const api = Beer4YourBuckAPI.getInstance();

export function HomePage() {
    const {user} = useContext(UserContext);
    const history = useHistory();
    const [reportedBeers, setReportedBeers] = useState<number | null>(null);
    const [reportedVenues, setReportedVenues] = useState<number | null>(null);

    useEffect(() => {
        if (user !== null) {
            history.push('/near');
        }
    });

    useEffect(() => {
        const callAPI = async () => {
            try {
                let newReportedBeers = await  api.getTotalNumberReportedBeers();
                if (newReportedBeers.data !== reportedBeers) {
                    setReportedBeers(newReportedBeers.data);
                }
                let newReportedVenues = await api.getTotalNumberReportedVenues();
                if (newReportedVenues.data !== reportedVenues) {
                    setReportedVenues(newReportedVenues.data);
                }
            } catch (e) {
                setReportedBeers(null);
                setReportedVenues(null);
            }
        };
        if (!reportedBeers || !reportedVenues) {
            callAPI();
        }
    }, [reportedBeers, reportedVenues]);

    return (
        <div className={'page-content'}>
            <div style={{width: '100%', height: '100%', color: "white", backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                <div className={'intro-text'}>
                    <h1>The Go-To Place To Find Cheap Beer</h1>
                    <h5 style={{margin: '0 auto', maxWidth: '32.4102564rem', padding: '5px'}}>We compare beers across multiple different restaurants, bars, breweries and stores to help you find the best deals near you!</h5>
                    {reportedBeers !== null && reportedVenues !== null && <h5 style={{margin: '0 auto', marginTop: '50px', maxWidth: '32.4102564rem'}}>{`${reportedBeers.toString()} beers and ${reportedVenues.toString()} venues added by our users!`}</h5>}
                    <div style={{position: 'absolute', bottom: 0, display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center"}}>
                        Find Out More
                        <IoIosArrowDown size={50} color={'white'}/>
                    </div>
                </div>
            </div>
            <div className={'home-info-item'}>
                <h4>How It Works</h4>
                <GiGears size={40}/>
                <p>
                    Our users report beers that they find at venue's they visit. We use the beer's price, percent ABV, volume,
                    and price to give every beer a baseline score. This score represents the ratio of the beer's alcohol
                    content to the price. Every beer is ranked by this score and displayed in the highest order for your
                    convenience. For any beer list on our site, the best Beer 4 Your Buck will be on the top!
                </p>
            </div>
            <hr/>
            <div className={'home-info-item'}>
                <h4>Find Reported Beers Near You</h4>
                <MdNearMe size={40}/>
                <p>
                    Find beers at restaurants, grocery stores, breweries and any other place that has beer near you. Use
                    the helpful filters to narrow the search results to what you are looking for. And remember, the Beer4YourBuck
                    will always be on top!
                </p>
            </div>
            <div className={'home-info-item'}>
                <h4>Compare Beers Where You Are</h4>
                <MdMyLocation size={40}/>
                <p>
                    Let us know where you are and compare beers other users have reported or create an account and add beers
                    that interest you! Every beer added to a venue will be available for other users to see and compare.
                    You can also confirm a beer has been accurately reported with an upvote or downvote any beer with inaccuracies.
                    This helps keep our data accurate and up to date for a better user experience for everyone!
                </p>
            </div>
            <hr/>
            <div className={'home-info-item'}>
                <h4>Quick Compare</h4>
                <MdCompareArrows size={40}/>
                <p>
                    Quickly compare beers without the need to be at a venue. Beers compared here will not be reported to
                    other users.
                </p>
            </div>
        </div>
    )
}