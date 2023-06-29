import './db.mjs';
import mongoose from 'mongoose';
import express from 'express';
import cors from "cors";

const app = express();

app.use(cors({
    credentials: true,
    origin: '*'
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// if mongoose is connected, set
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Wishlist = mongoose.model('Wishlist');

app.get('/user', (req, res) => {
    const { email, password } = req.query;
    // find user with email and password
    User.findOne({ email_address: email, password: password }).then((user) => {
        // if user is found, return user
        if (user) {
            res.json(user)
        } else {
            // if user is not found, return null
            res.json(null);
        }
    });
});

app.post('/user', async (req, res) => {
    // create a new user with a wishlistschema linked to user.wisjlist
    const user = new User({...req.body, email_address: req.body.email});
    await user.save()
        .then(async (savedUser) => {
            res.json(savedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Username already taken!' })
        });
});

app.post('/updateprofile', async (req, res) => {
    // this holds an array where the first element is the object of the initial user
    // and the second element is the object of the updated user
    const { initialUser, updatedUser } = req.body;
    // find user with email and password
    User.findOneAndUpdate(
        { email_address: initialUser.email_address, password: initialUser.password }, 
        updatedUser,
        { new: true }
    )
        .then(async (user) => {
            // if user is updated, return it, and if it isnt, return null
            if (user) {
                await user.save()
                    .then((savedUser) => {
                        res.json(savedUser);
                    })
            } else {
                res.json(null);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'User update failed' });
        });
});

app.post("/createitem", async (req, res) => {
    // find user with username
    try {
        await User.findOne({ username: req.body.userName }).then(async (user) => {
            if (user) {
                // save item here
                const item = new Item({
                    name: req.body.name,
                    price: Number(req.body.price),
                    description: req.body.description,
                    newused: req.body.newused,
                    
                    // seller is a reference to the seller, so link to matching username
                    seller: user,
                });
                await item.save()

                // if listed_items exists, push item to it, else create it
                if (user.listed_items) {
                    user.listed_items.push(item);
                } else {
                    user.listed_items = [item];
                }
                await user.save()
                return res.status(200).json({ success: true, item });
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item creation failed' });
    }
});

app.get("/listeditems", async (req, res) => {
    let username = req.query.username;
    try {
        const user = await User.findOne({ username: username }).populate('listed_items');
        if (user) {
            // user.listed_items will contain the populated items
            res.json(user.listed_items);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

app.post("/addtoseller", async (req, res) => {
    const { name, price, description, newused, images, username } = req.body;
    try {
        await User.findOne({ username: "MainSeller" }).then(async (user) => {
            if (user) {
                // save item here
                const item = new Item({
                    name, price, description, newused, images,
                    // seller is a reference to the seller, so link to matching username
                    seller: user,
                });
                await item.save();

                // add item to "MainSeller" listed_items
                user.listed_items.push(item);
                await user.save()
                
                // now add item to user's shopping cart
                const user2 = await User.findOne({ username: username });
                if (user2) {
                    if (user2.shopping_cart) {
                        user2.shopping_cart.push(item);
                    } else {
                        user2.shopping_cart = [item];
                    }
                    await user2.save();
                }
            }
        })
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item creation failed' });
    }
});

app.get('/getallitems', async (req, res) => {
    try {
        const items = await Item.find({}).populate('seller');
        if (items) {
            res.json(items);
        } else {
            res.status(404).json({ error: 'Items not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

app.get('/getuser', async (req, res) => {
    let username = req.query.username;
    try {
        await User.findOne({ username: username }).populate({
            path: 'listed_items',
            populate: {
                path: 'seller'
            }
        })
            .then(async (user) => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

app.get(`/cart`, async (req, res) => {
    let username = req.query.username;
    try {
        await User.findOne({ username: username }).populate({
            path: 'shopping_cart',
            populate: {
                path: 'seller'
            }
        })
            .then(async (user) => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/addtocart', async (req, res) => {
    const { item, username } = req.body;
    try {
        await Item.findOne({ name: item.name }).then(async (item) => {
            if (item) {
                // now add item to user's shopping cart
                await User.findOne({ username: username }).then(async (user) => {
                    if (user) {
                        if (user.shopping_cart) {
                            user.shopping_cart.push(item);
                        } else {
                            user.shopping_cart = [item];
                        }
                        await user.save();
                    }
                })
            }
        })
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item creation failed' });
    }
})

app.post('/deleteitemfromcart', async (req, res) => {
    const { username, itemid } = req.body;
    try {
        await User.findOne({ username: username }).then(async (user) => {
            if (user) {
                // remove item from user's shopping cart
                user.shopping_cart.pull({ _id: itemid });
                await user.save();
            }
        })
        return res.status(200).json({ success: true, _id: itemid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item deletion failed' });
    }
})

app.post('/addtowishlist', async (req, res) => {
    const { item, username } = req.body;
    try {
        await Item.findOne({ name: item.name }).then(async (item) => {
            if (item) {
                // now add item to user's shopping cart
                await User.findOne({ username: username }).populate('wishlist').then(async (user) => {
                    if (user) {
                        // user.wishlist references wishlistSchema
                        // user.wishlist.items references itemSchema
                        await Wishlist.findOne({ user }).populate('items').then(async (wishlist) => {
                            if (wishlist) {
                                wishlist.items.push(item);
                                await wishlist.save();
                            } else {
                                const newwishlist = new Wishlist({
                                    user, items: [item]
                                })
                                await newwishlist.save();
                                user.wishlist = newwishlist;
                                await user.save();
                            }
                        })
                    }
                })
            }
        })
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item creation failed' });
    }
})

app.get(`/wishlist`, async (req, res) => {
    let username = req.query.username;
    try {
        await User.findOne({ username }).populate({
            path: 'wishlist',
            populate: {
                path: 'items',
                populate: {
                    path: 'seller'
                }
            }
        })
            .then(async (user) => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/addimages', async (req, res) => {
    const { itemid, images } = req.body;
    try {
        await Item.findOne({ _id: itemid }).then(async (item) => {
            if (item) {
                item.images = images;
                await item.save();
            }
        })
        return res.status(200).json({ success: true })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item image adding failed' });
    }
})

app.get('/deleteitem', async (req, res) => {
    const { itemid } = req.query;
    try {
        await Item.findOne({ _id: itemid }).then(async (item) => {
            if (item) {
                await User.findOne({ _id: item.seller }).then(async (user) => {
                    if (user) {
                        user.listed_items.pull({ _id: itemid });
                        await user.save();
                    }
                })
                await Item.deleteOne({ _id: itemid });
            }
        })
        return res.status(200).json({ success: true })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item deletion failed' });
    }
})

app.post('/updateitem', async (req, res) => {
    const { name, price, description, newused, itemid } = req.body;
    try {
        await Item.findOne({ _id: itemid }).then(async (item) => {
            if (item) {
                item.name = name;
                item.price = price;
                item.description = description;
                item.newused = newused;
                await item.save();
            }
        })
        return res.status(200).json({ success: true, itemid })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Item update failed' });
    }
})

app.listen(process.env.PORT || 3001);