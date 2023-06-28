import { useState, useContext } from "react"
import { AuthContext, fetchlink } from "../App"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import '../assets/css/signup.css'


export default function Signup() {
    const [role, setRole] = useState("")
    const { setUser } = useContext(AuthContext);
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    return (
        <div>
            {role === "" ? (
                <div>
                    <h1 id="signuph1">Sign Up</h1>
                    <div id="gridthumbs-signup" className="portfolio-grid-overlay grid-wrapper collection-content-wrapper">
                        {["Seller", "Buyer"].map((role, index) => (
                            <div className="carddiv" onClick={() => setRole(role)} key={index}>
                                <div className="carddiv-content">
                                    <img 
                                        alt="cardimg"
                                        src={require(`../images/${role.toLowerCase()}.jpg`)}
                                        // style={{width: "100%", height: "100%", objectPosition: "50% 50%", objectFit: "cover"}}
                                    />
                                    <h3 className="roles">{role}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // this will be signup form
                <div>
                    <h1 id="signuph2" className="h1s">Welcome New {role}</h1>
                    <div id="logindiv" className="globaldiv text1">
                        <div id="loginform" className="globaldiv">
                            <div className='labeldiv'>
                                <label>Username</label>
                                <input type="text" onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className='labeldiv'>
                                <label>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                <input type="text" placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='labeldiv'>
                                <label>Password</label>
                                <input type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {/* when we click signup make a call to the express app with /user endpoint */}
                            <button className="btn btn-outline-success my-2 my-sm-0 align-self-center" onClick={() => {
                                console.log(`username: ${username}, email: ${email}, password: ${password}, role: ${role}`)
                                // fetch to localhost:3001/user
                                fetch(`${fetchlink}/user`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({username, email, password, role})
                                })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.error) {
                                        toast.error(data.error, {
                                            position: toast.POSITION.TOP_CENTER,
                                            colored: true,
                                        })
                                    } else {
                                        // setuser in authcontext
                                        setUser(data)
                                        toast.success("Signed up successfully", {
                                            position: toast.POSITION.TOP_CENTER,
                                            colored: true,
                                        })
                                        navigate("/")
                                    }
                                })
                                .catch(err => toast.error("Error signing up"))
                            }}>
                                Sign Up
                            </button>
                        </div>
                        <img id="signuppic" className="carddiv" src={require(`../images/lion_head.png`) }
                            alt="log in pic" style={{width: '48%', borderRadius: '12px'}}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}