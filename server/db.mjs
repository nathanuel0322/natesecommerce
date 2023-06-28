// will hold the schema for the database

import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/commerce";
mongoose.connect(CONNECTION_STRING);

// create a User Schema
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: false},
    email_address: {type: String, required: true},
    // role will either be seller or buyer
    role: {type: String, required: true},
    // link to a shopping cart
    shopping_cart: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
    listed_items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
    interests: [{type: String, required: false}],
    // link to a wishlist
    wishlist: {type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'},
});

const ItemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    newused: {type: String, required: true},
    link: String,
    images: [String],
    // reference to the seller
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    wishlist_users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

const WishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
});

// link the slug plugin to the ItemSchema
ItemSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>' });

mongoose.model('User', UserSchema);
mongoose.model('Item', ItemSchema);
mongoose.model('Wishlist', WishlistSchema);
