import React, { useContext, useState } from "react";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUserSecret, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"
import axios from "axios";
import { useMediaQuery } from 'react-responsive';

export default function Navbar({ drawerfunc }) {
    const { user, setUser } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const showButton = useMediaQuery({ query: '(min-width: 992px)' })

    return (
        <div>
            {showButton ? (
                <nav id="navbarid" className="flex flex-row justify-evenly navbar navbar-expand-lg navbar-light bg-light text1">
                    <a className="navbar-brand" style={{fontFamily:'gothicFont', fontSize:"2.5rem"}} href="/">Nate's E-commerce</a>
                    <div className="collapse" id="navbarSupportedContent">
                        <form className="form-inline my-2 my-lg-0">
                            <input style={{borderRadius: '17px'}} className="form-control mr-sm-2" type="search" placeholder="What you want" aria-label="Search"
                                value={searchTerm} onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                }}
                            />
                            <button style={{borderRadius: '17px'}} className="btn btn-outline-success my-2 my-sm-0" type="submit"
                                disabled={loading}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    const options = {
                                        method: 'GET',
                                        url: 'https://asos2.p.rapidapi.com/products/v2/list',
                                        params: {
                                        store: 'US',
                                        offset: '0',
                                        categoryId: '4766',
                                        limit: '50',
                                        country: 'US',
                                        sort: 'freshness',
                                        q: searchTerm,
                                        currency: 'USD',
                                        sizeSchema: 'US',
                                        lang: 'en-US'
                                        },
                                        headers: {
                                        'X-RapidAPI-Key': '9f1ade9947msh7d484e4cb819d50p1a2bf7jsn17262387e930',
                                        'X-RapidAPI-Host': 'asos2.p.rapidapi.com'
                                        }
                                    };
                                    
                                    try {
                                        const response = await axios.request(options);
                                        console.log("data:", response.data);
                                        setLoading(false);
                                        navigate(`/search/${searchTerm}`, { state: { items: response.data.products } });
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                {loading ? "Loading..." : "Search"}
                            </button>
                        </form>
                        <ul className="navbar-nav mr-3 ml-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/#">Home</a>
                            </li>
                            {user && user.role === "Seller" && (
                                <li className="nav-item active">
                                    <a className="nav-link" href="/#/listeditems">Selling</a>
                                </li>
                            )}
                        </ul>
                        {/* button to navigate to Create Item */}
                        {user && user.role === "Seller" && (
                            <button
                                className="btn btn-outline-success my-2 my-sm-0 mr-3"
                                onClick={() => {
                                    navigate("/createitem")
                                }}
                            >
                                Upload Product
                            </button>
                        )}
                        {/* button that will show "Log In" if not signed in, and "Sign U"  */}
                        <button style={{marginRight: '1vw'}} onClick={() => navigate("/profile")}>
                            {user ? (
                                <FontAwesomeIcon icon={faUserTie} size="2xl"/>
                            ) : (
                                <FontAwesomeIcon icon={faUserSecret} size="2xl" />
                            )}
                        </button>
                        {user && user.role === "Buyer" ? (
                            <button onClick={() => drawerfunc(true)}>
                                <FontAwesomeIcon icon={faCartShopping} size="2xl" />
                            </button>
                        ) : (
                            !user && (
                                <button onClick={() => navigate("/login")}>
                                    <FontAwesomeIcon icon={faCartShopping} size="2xl" />
                                </button>
                            )
                        )}
                        {user && (
                            <button
                                className="btn btn-outline-red my-2 my-sm-0 ml-3"
                                onClick={() => {
                                    setUser(null);
                                    toast.success("Logged out successfully!");
                                    navigate("/");
                                }}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </nav>
            ) : (
                // with showbutton showing
                <nav id="navbarid" className="flex flex-col justify-evenly navbar navbar-expand-lg navbar-light bg-light text1">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}> 
                        <a className="navbar-brand" style={{fontFamily:'gothicFont', fontSize:"2.5rem"}} href="/">Nate's E-commerce</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className="collapse" id="navbarSupportedContent">
                        <form className="form-inline my-2 my-lg-0">
                            <input style={{borderRadius: '17px'}} className="form-control mr-sm-2" type="search" placeholder="What you want" aria-label="Search"
                                value={searchTerm} onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                }}
                            />
                            <button style={{borderRadius: '17px'}} className="btn btn-outline-success my-2 my-sm-0" type="submit"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    const options = {
                                        method: 'GET',
                                        url: 'https://asos2.p.rapidapi.com/products/v2/list',
                                        params: {
                                        store: 'US',
                                        offset: '0',
                                        categoryId: '4766',
                                        limit: '50',
                                        country: 'US',
                                        sort: 'freshness',
                                        q: searchTerm,
                                        currency: 'USD',
                                        sizeSchema: 'US',
                                        lang: 'en-US'
                                        },
                                        headers: {
                                        'X-RapidAPI-Key': '9f1ade9947msh7d484e4cb819d50p1a2bf7jsn17262387e930',
                                        'X-RapidAPI-Host': 'asos2.p.rapidapi.com'
                                        }
                                    };
                                    
                                    try {
                                        const response = await axios.request(options);
                                        console.log("data:", response.data);
                                        setLoading(false);
                                        navigate(`/search/${searchTerm}`, { state: { items: response.data.products } });
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                {loading ? "Loading..." : "Search"}
                            </button>
                        </form>
                        <ul className="navbar-nav mr-3 ml-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/#">Home</a>
                            </li>
                            {user && user.role === "Seller" && (
                                <li className="nav-item active">
                                    <a className="nav-link" href="/#/listeditems">Selling</a>
                                </li>
                            )}
                        </ul>
                        {/* button to navigate to Create Item */}
                        {user && user.role === "Seller" && (
                            <button
                                className="btn btn-outline-success my-2 my-sm-0 mr-3"
                                onClick={() => {
                                    navigate("/createitem")
                                }}
                            >
                                Upload Product
                            </button>
                        )}
                        {/* button that will show "Log In" if not signed in, and "Sign Up"  */}
                        <button style={{marginRight: '1vw'}} onClick={() => navigate("/profile")}>
                            {user ? (
                                <FontAwesomeIcon icon={faUserTie} size="2xl"/>
                            ) : (
                                <FontAwesomeIcon icon={faUserSecret} size="2xl" />
                            )}
                        </button>
                        <button onClick={() => {
                            if (user) {
                                drawerfunc(true);
                            } else {
                                navigate("/signup");
                            }
                        }}>
                            <FontAwesomeIcon icon={faCartShopping} size="2xl" />
                        </button>
                        {user && (
                            <button
                                className="btn btn-outline-red my-2 my-sm-0 ml-3"
                                onClick={() => {
                                    setUser(null);
                                    toast.success("Logged out successfully!");
                                    navigate("/");
                                }}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </nav>
            )}
        </div>
    )
}