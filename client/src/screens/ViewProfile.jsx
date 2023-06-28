import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, fetchlink } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewProfile() {
    const params = useParams()
    const [viewedUser, setViewedUser] = useState({})
    useEffect(() => {
        fetch(`${fetchlink}/getuser?username=${params.id}`)
            .then(res => res.json())
            .then(data => setViewedUser(data))
    }, [])

    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            {viewedUser.role && (
                <div id="profilemaindiv">
                    <h1 className='h1s'>{viewedUser.username}</h1>
                    <div id="profileparentdiv"  className='text1'>
                        <img id="profilepic"
                            src={require(`../images/${viewedUser.role.charAt(0).toLowerCase() + viewedUser.role.slice(1)}.jpg`)}
                            alt="profile pic"
                        />
                        <div id='profilediv' className='globaldiv'>
                            <p>Role: {viewedUser.role}</p>
                            <p>Email: {viewedUser.email_address}</p>
                            <div className="content-wrapper text1">
                                <div className="content">
                                    <div id="gridThumbs" style={{padding: '0px'}}
                                        className="portfolio-grid-overlay grid-wrapper collection-content-wrapper" data-controller="GridImages" data-animation-role="section" data-controllers-bound="GridImages">
                                        {viewedUser.listed_items.map((item, index) => {
                                            return (
                                                <a className="grid-item"
                                                    onClick={() => {
                                                        navigate(`/details/${item.slug}`, 
                                                            { state: { item: {...item, seller: item.seller.username } } }
                                                        )
                                                    }}
                                                    key={index}
                                                >
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}