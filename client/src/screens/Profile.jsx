import React, { useState, useContext } from 'react';
import Select from 'react-select'
import { toast } from 'react-toastify';
import { AuthContext, fetchlink } from '../App'
import { useNavigate } from 'react-router-dom';
import '../assets/css/profile.css'

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [interests, setInterests] = useState(user.interests.map(interest => ({value: interest, label: interest})));
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [address, setAddress] = useState(user.address);
    const navigate = useNavigate();

    const options = [
        { value: 'Electronic', label: 'Electronic' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Pets', label: 'Pets' },
        { value: 'Toys', label: 'Toys' },
        { value: 'Jewelry', label: 'Jewelry' },
        { value: 'Sports', label: 'Sports' },
    ]

    return (
        <div>
            <h1 className='h1s'>Profile</h1>
            <div id="profileparentdiv"  className='text1'>
                <img id="profilepic" src={require(`../images/${user.role.charAt(0).toLowerCase() + user.role.slice(1)}.jpg`)}
                    alt="profile pic"
                />
                <div id='profilediv' className='globaldiv'>
                    <p>Role: {user.role}</p>
                    <p>Email: {user.email_address}</p>
                    <div className='labeldiv'>              
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    {/* <p>Username: {user.username}</p> */}
                    
                    <div className='labeldiv'>
                        <label>Password:</label>
                        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {user.role === "Buyer" &&
                        <div className='labeldiv'>
                            <label>Address:</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    }
                    {/* users will have a 6-length lists of interests as a checkbox */}
                    {user.role === "Buyer" &&
                        <Select
                            isMulti
                            name="interests"
                            options={options}
                            value={interests}
                            onChange={(val) => {
                                setInterests(val);
                                console.log("interests is now: ", interests)
                            }}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                    margin: 'auto',
                                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                    fontSize: '1rem',
                                }),
                            }}
                            placeholder="Select your interests..."
                        />
                    }
                    <button className="btn btn-outline-success my-sm-0 ml-5 " onClick={() => 
                        fetch(`${fetchlink}/updateprofile`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            // make a call where the first object in the array is the original user object
                            // and the second object is the updated user object
                            body: JSON.stringify({
                                initialUser: user,
                                updatedUser: {...user, username, password, address, interests: interests.map(interest => interest.value)},      
                            }),
                        })
                            .then(res => res.json())
                            .then(data => {
                                setUser(data)
                                toast.success("Profile updated successfully!")
                                navigate('/')
                            })
                    }>
                        Confirm Changes
                    </button>
                </div>
            </div>
        </div>
    )
}