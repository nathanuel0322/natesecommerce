import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchResults() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const { items } = location.state;
    console.log("items: ", items);
    const navigate = useNavigate();

    return (
        <div className="content-wrapper">
            <div className="content text1">
                <div id="gridThumbs" className="portfolio-grid-overlay grid-wrapper collection-content-wrapper" data-controller="GridImages" data-animation-role="section"
                    data-controllers-bound="GridImages"
                >
                    {items.map((item, index) => {
                        console.log("item is: ", item)
                        return (
                            // we need to navigate to details and pass in the entire item object
                            <a className="grid-item" key={index} onClick={() => {
                                navigate(`/details/${item.productCode}`, { state: 
                                    { item: {...item, images: [item.imageUrl], 
                                        description: item.brandName, price: item.price.current.text.substring(1), newused: false,
                                        seller: "MainSeller"
                                    }}
                                });
                            }}>
                                <div className="grid-image">
                                    <div className="grid-image-inner-wrapper">
                                        {/* change this later */}
                                        <img src={`https://${item.imageUrl}`} style={{width: "100%", height: "100%", objectPosition: "50% 50%", objectFit: "cover"}}/>
                                    </div>
                                </div>
                                <div className="portfolio-overlay"></div>
                                <div className="portfolio-text">
                                    <h3 className="portfolio-name">{item.name}</h3>
                                    <br />
                                    <h3 className="portfolio-price">{item.price.current.text}</h3>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}