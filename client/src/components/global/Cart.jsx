import { useContext, useState, useEffect } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { AuthContext, fetchlink } from '../../App';
import { toast } from 'react-toastify';
import '../../assets/css/sidedrawer.css'

export default function Cart({ drawerstate, drawerfunc }) {
    const { user } = useContext(AuthContext);
    const [currentCart, setCurrentCart] = useState([]);

    useEffect(() => {
        if (drawerstate) {
            if (user) {
                // check backend for current cart
                fetch(`${fetchlink}/cart?username=${user.username}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            toast.error(data.error);
                        } else {
                            setCurrentCart(data.shopping_cart);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        toast.error("Error getting cart");
                    })
            }
        } else {
            drawerfunc(false);
        }

    }, [drawerstate])

    return (
        <SwipeableDrawer
            anchor={'right'}
            open={drawerstate}
            onClose={() => drawerfunc(false)}
            onOpen={() => drawerfunc(true)}
        >
            <div>
                <div>
                    <IconButton onClick={() => drawerfunc(false)} sx={{justifyContent: 'flex-start'}}>
                        <CloseIcon fontSize='small' sx={{width: 1/4, height: 1/4, color: "white"}} />
                    </IconButton>
                </div>
                <div className="cart-container">
                    {currentCart.map((item, index) => {
                        return (
                            <div className="cartitem" key={index}>
                                <img key={index} src={item.images[0]} alt={'item'} 
                                    style={{width: "10vw", objectPosition: "50% 50%", objectFit: "cover"}}
                                    className='cartimg'
                                />
                                <div style={{marginLeft: "1vw"}}>
                                    <h3 className="portfolio-name">{item.name}</h3>
                                    <h3 className="portfolio-price">${item.price}</h3>
                                </div>
                                {/* delete button */}
                                <button className="btn btn-outline-red my-2 my-sm-0 ml-3"
                                    onClick={() => {
                                        fetch(`${fetchlink}/deleteitemfromcart`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                username: user.username,
                                                itemid: item._id
                                            })
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.error) {
                                                    toast.error(data.error);
                                                } else {
                                                    toast.success("Item deleted from cart");
                                                    setCurrentCart(currentCart.filter((item) => item._id !== data._id));
                                                }
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                toast.error("Error deleting item from cart");
                                            })
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </SwipeableDrawer>
    );
}