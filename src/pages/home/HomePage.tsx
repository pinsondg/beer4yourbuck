import React from "react";
import './home-page.css'
import Background from '../../image/domain/stock/selective-focus-photography-of-people-having-a-toast-1269043.jpg'
import {IoIosArrowDown} from "react-icons/all";

export function HomePage() {

    return (
        <div className={'page-content'}>
            <div style={{width: '100%', height: '100%', color: "white", backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                <div className={'intro-text'}>
                    <h1>The Go To Place To Find Cheap Beer</h1>
                    <h5 style={{margin: '0 auto', maxWidth: '32.4102564rem'}}>We compare beers across multiple different restaurants, bars, breweries and stores to help you find the best deals near you!</h5>
                    <div style={{position: 'absolute', bottom: 0, display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center"}}>
                        Find Out More
                        <IoIosArrowDown size={50} color={'white'}/>
                    </div>
                </div>
            </div>
            <div className={'home-info-item'}>
                <h5>How It Works</h5>
                <p>
                    Our users report beers that they find at venue's they visit. We use the beer's price, percent ABV, volume,
                    and price to give evey beer a baseline score. This score represents how much alcohol is in the beer
                    compared to the price. Every beer is ranked by this score and displayed in the highest order for your
                    convenience. For any beer list on our website, the best Beer 4 Your Buck will be on the top!
                </p>
            </div>
            <hr/>
            <div className={'home-info-item'}>
                <h5>Find Cheap Beers Closest To You</h5>
                <p>

                </p>
            </div>
        </div>
    )
}