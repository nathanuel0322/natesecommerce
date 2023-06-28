import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, fetchlink } from '../App';
import { useNavigate } from 'react-router-dom';
import '../assets/css/home.css';

export default function Home() {
    const { user } = useContext(AuthContext)
    const [items, setItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${fetchlink}/getallitems`)
            .then(res => res.json())
            .then(data => {
                // reverse data
                setItems(data.reverse());
                if (user && user.role === 'Buyer') {
                    fetch(`${fetchlink}/wishlist?username=${user.username}`)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            console.log("returned wishlist items", data2)
                            if (data2.wishlist) {
                                setWishlistItems(data2.wishlist.items.reverse())
                            }
                        })
                }
            })
    }, [])

    return (
        <div>
            {user && <h1 className='h1s'>Welcome, {user.username}</h1>}
            <div className="content-wrapper text1">
                <div id='homepagecontent' className="content">
                    {user && user.role === 'Buyer' && (
                        <div id='lefthome'>
                            <p style={{textAlign: 'center', textDecoration: 'underline', fontSize: '150%'}}>Wishlist</p>
                            {wishlistItems.length === 0 ? 
                                <p style={{textAlign: 'center', marginBlock: '2vh', fontSize: '120%'}}>No items in wishlist</p>
                            :
                                <div id="wishlistdiv" className="portfolio-grid-overlay grid-wrapper collection-content-wrapper" data-controller="GridImages" data-animation-role="section" data-controllers-bound="GridImages">
                                    {wishlistItems.map((item, index) => {
                                        console.log("item", item)
                                        return (
                                            <a className="grid-item"
                                                onClick={() => {
                                                    navigate(`/details/${item.slug}`, 
                                                        { state: { 
                                                            item: {...item, 
                                                                seller: item.seller.username
                                                            }
                                                        } }
                                                    )
                                                }}
                                                key={index}>
                                                <div className="grid-image">
                                                    <div className="grid-image-inner-wrapper">
                                                        <img src={item.images[0]} alt='itemimg'
                                                            style={{width: "100%", height: "100%", objectPosition: "50% 50%", objectFit: "cover"}}
                                                        />
                                                    </div>
                                                </div>
                                            </a>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    )}
                    <div id='righthome'>
                        <p style={{textAlign: 'center', textDecoration: 'underline', fontSize: '150%'}}>For Sale</p>
                        <div id="gridThumbs" className="portfolio-grid-overlay grid-wrapper collection-content-wrapper" data-controller="GridImages" data-animation-role="section"
                            data-controllers-bound="GridImages"
                        >
                            {items.map((item, index) => {
                                console.log("item", item)
                                return (
                                    <a className="grid-item"
                                        onClick={() => {
                                            navigate(`/details/${item.slug}`, 
                                                { state: { 
                                                    item: {...item, seller: item.seller.username
                                                    }
                                                } }
                                            )
                                        }}
                                        key={index}>
                                        <div className="grid-image">
                                            <div className="grid-image-inner-wrapper">
                                                <img src={item.images[0]} alt='itemimg'
                                                    style={{width: "100%", height: "100%", objectPosition: "50% 50%", objectFit: "cover"}}
                                                />
                                            </div>
                                        </div>
                                        <div className="portfolio-overlay"></div>
                                        <div className="portfolio-text">
                                            <h3 className="portfolio-name">{item.name}</h3>
                                            <br />
                                            <h3 className="portfolio-price">${item.price}</h3>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}