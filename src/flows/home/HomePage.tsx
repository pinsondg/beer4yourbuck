import React from "react";
import './home-page.css'

export function HomePage() {

    return (
        <div className={'page-content'}>
            <h1>Beer 4 Your Buck</h1>
            <h3>About</h3>
            <div className={'body'}>
                <p>
                    Do you like drinking beer? Do you like finding the best deals? Than you've come to the right place!
                    Beer 4 Your buck is an application that helps you find the beer with the most alcohol for the cheapest amount.
                </p>
            </div>
        </div>
    )
}