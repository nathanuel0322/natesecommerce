import { useState, useContext } from "react"
import { AuthContext, fetchlink } from '../App'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import '../assets/css/login.css'

export default function Login() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <h1 className="h1s">Log In</h1>
            <div id="logindiv" className="globaldiv text1" >
                {/* <div id="loginform" className="globaldiv col-3"> */}
                <div id="loginform" className="globaldiv">
                    <div className='labeldiv'>              
                        <label>E-mail&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <input type="text" placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='labeldiv'>              
                        <label>Password&nbsp;&nbsp;</label>
                        <input className="" type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div style={{alignSelf: "center", display: 'flex', flexDirection: 'row', columnGap: '3vw'}}>
                        <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => navigate("/signup")}>Sign Up</button>
                        {/* make call to index.mjs and get user with matching details using "?" query */}
                        <button className="btn btn-outline-success my-2 my-sm-0 ml-xl-5" onClick={() => {
                            // pass {email, password} to index.mjs on local
                            fetch(`${fetchlink}/user?email=` + email + "&password=" + password, {
                                method: "GET",
                                headers: {"Content-Type": "application/json"}
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data) {
                                        setUser(data);
                                        toast.success("Logged in successfully", {
                                            position: toast.POSITION.TOP_CENTER,
                                            colored: true,
                                        })
                                        navigate("/")
                                    } else {
                                        toast.error("Invalid email or password")
                                    }
                                })
                                .catch(err => toast.error("Invalid email or password"))
                        }}>
                            Log In
                        </button>
                    </div>
                </div>
                <img id="loginpic" className="carddiv" src={require(`../images/lion_head.png`) }
                    alt="log in pic" style={{width: '48%', borderRadius: '12px'}}
                />
            </div>
        </div>
    )
}