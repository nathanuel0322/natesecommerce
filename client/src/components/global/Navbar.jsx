import React, { useContext, useState } from "react";
import { AuthContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUserSecret, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"
import axios from "axios";
import { useMediaQuery } from 'react-responsive';
import '../../assets/css/navbar.css'

export default function Navbar({ drawerfunc }) {
    const { user, setUser } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const showButton = useMediaQuery({ query: '(min-width: 992px)' })
    const shortenTitle = useMediaQuery({ query: '(max-width: 355px)' })
    const searchbartoowide = useMediaQuery({ query: '(max-width: 1170px)' })

    return (
        <div>
            <nav id="navbarid" className="flex justify-evenly navbar navbar-expand-lg navbar-light bg-light text1">
                {showButton ? (
                    ((shortenTitle) || (user && user.role === "Seller" && searchbartoowide)) ?
                        <img src={require('../../assets/icons/ecommerceicon.png')} alt="icon" width={40} height={40}
                            style={{cursor: 'pointer', marginRight: '.5rem'}}
                            onClick={() => navigate('/')}
                        />
                    :
                        // here, width is at least 356px
                        <Link className="navbar-brand" to={"/"}>
                            Nate's E-commerce
                        </Link>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}> 
                        {((shortenTitle) || (user && user.role === "Seller" && searchbartoowide)) ?
                            <img src={require('../../assets/icons/ecommerceicon.png')} alt="icon" width={40} height={40}
                                style={{cursor: 'pointer', marginRight: '.5rem'}}
                                onClick={() => navigate('/')}
                            />
                        :
                            <Link className="navbar-brand" to={"/"}>
                                Nate's E-commerce
                            </Link>
                        }
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                )}
                <div className="collapse" id="navbarSupportedContent">
                    <form className="form-inline my-2 my-lg-0">
                        <input id="searchbox" className="form-control mr-sm-2" type="search" placeholder="What you want" aria-label="Search"
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
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {user && user.role === "Seller" && (
                            <li className="nav-item active">
                                <Link className="nav-link" to="/listeditems">Selling</Link>
                            </li>
                        )}
                    </ul>
                    {/* button to navigate to Create Item */}
                    {user && user.role === "Seller" && (
                        <Link className="btn btn-outline-success my-2 my-sm-0 mr-3" to={"/createitem"}>
                            Upload Product
                        </Link>
                    )}
                    {/* button that will show "Log In" if not signed in, and "Sign U"  */}
                    <Link className="mr-3" to={"/profile"}>
                        {user ? (
                            <FontAwesomeIcon icon={faUserTie} size="2xl"/>
                        ) : (
                            <FontAwesomeIcon icon={faUserSecret} size="2xl" />
                        )}
                    </Link>
                    <button onClick={() => {
                        if (user && user.role === "Buyer") {
                            drawerfunc(true)
                        } else if (!user) {
                            navigate("/login")
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
        </div>
    )
}