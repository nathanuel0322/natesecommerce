import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../../App';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from '../../screens/Home';
import Login from '../../screens/Login';
import Signup from '../../screens/Signup';
import Navbar from './Navbar';
import Profile from '../../screens/Profile';
import CreateItem from '../../screens/CreateItem';
import ListedItems from '../../screens/ListedItems';
import EditItem from '../../screens/EditItem';
import SearchResults from '../../screens/SearchResults';
import ItemDetails from '../../screens/ItemDetails';
import ViewProfile from '../../screens/ViewProfile';
import Cart from './Cart';

export default function Routing() {
    const { user } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Router>
            <Navbar drawerfunc={setDrawerOpen} />
            {user && <Cart drawerstate={drawerOpen} drawerfunc={setDrawerOpen} />}
            {user ? (
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='profile' element={<Profile />} /> 
                    <Route exact path='createitem' element={<CreateItem />} />
                    <Route exact path='listeditems' element={<ListedItems />} />
                    <Route exact path='/edititem/:id' element={<EditItem />} />
                    <Route exact path='/details/:id' element={<ItemDetails />} />
                    <Route path='/search/:searchtag' element={<SearchResults />} />
                    <Route exact path='/profile/:id' element={<ViewProfile />} />
                </Routes>
            ) : (
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/signup" element={<Signup />} />
                    <Route path='/search/:searchtag' element={<SearchResults />} />
                    <Route exact path='/details/:id' element={<ItemDetails />} />
                    <Route exact path='/profile/:id' element={<ViewProfile />} />
                    {/* same for profile */}
                    <Route exact path='/profile' element={<Navigate to='/login' />} />
                </Routes>
            )}
        </Router>
    )
}