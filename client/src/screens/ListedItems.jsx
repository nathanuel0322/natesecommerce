import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, fetchlink } from '../App';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

export default function ListedItems() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${fetchlink}/listeditems?username=${user.username}`)
            .then(res => res.json())
            .then((data) => setItems(data))
    }, [])

    return (
        <div className="content-wrapper">
            <div class="content text1">
                <div id="gridThumbs" class="portfolio-grid-overlay grid-wrapper collection-content-wrapper" data-controller="GridImages" data-animation-role="section"
                    data-controllers-bound="GridImages"
                >
                    {items.map((item, index) => {
                        return (
                            // we need to navigate to details and pass in the entire item object
                            <a class="grid-item" key={index} onClick={() => navigate(`/edititem/${item.slug}`, { state: { item } } ) }>
                                <div class="grid-image">
                                    <div class="grid-image-inner-wrapper">
                                        {/* change this later */}
                                        <img
                                            src={item.images[0]}
                                            style={{width: "100%", height: "100%", objectPosition: "50% 50%", objectFit: "cover"}}
                                        />
                                    </div>
                                </div>
                                <div class="portfolio-overlay"></div>
                                <div class="portfolio-text">
                                    <h3 class="portfolio-name">{item.name}</h3>
                                    <br />
                                    <h3 class="portfolio-price">${item.price}</h3>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}