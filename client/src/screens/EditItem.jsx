import { useContext, useState, useEffect } from 'react'
import Select from 'react-select'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext, fetchlink } from '../App'
import { storage } from '../firebase.js'
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import '../assets/css/createitem.css'

export default function EditItem() {
    const location = useLocation();
    const { item } = location.state;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [name, setName] = useState(item.name)
    const [price, setPrice] = useState(item.price)
    const [description, setDescription] = useState(item.description)
    const [newused, setNewused] = useState({ value: item.newused, label: item.newused })
    const [finalfiles, setFinalfiles] = useState(item.images)    
    const [loading, setLoading] = useState(false);

    const options = [
        {value: 'Brand New', label: 'Brand New'},
        {value: 'Open Box', label: 'Open Box'},
        {value: 'Used', label: 'Used'},
        {value: 'Refurbished', label: 'Refurbished'}
    ]

        async function fetchImages() {
            const storageRef = ref(storage, `images/${item._id}`);
            const imagesRef = await listAll(storageRef);
            // place all these images into the imagesdiv
            imagesRef.items.forEach(async (imageRef) => {
                const url = await getDownloadURL(imageRef);
                const imgdiv = document.createElement('div');
                imgdiv.className = 'imgdiv';
                const imagePreview = document.createElement('img');
                imagePreview.src = url;
                // add a button with className="btn btn-outline-red my-2 my-sm-0" to remove the image
                const removebtn = document.createElement('button');
                removebtn.className = 'btn btn-outline-red my-2 my-sm-0';
                removebtn.innerHTML = 'Remove';
                removebtn.onclick = (e) => {
                    e.preventDefault();
                    // remove from firebase storage
                    deleteObject(imageRef);
                    // remove the image from the array
                    const newfiles = Array.from(finalfiles).filter((file) => file !== url);
                    setFinalfiles(newfiles);
                }
                imgdiv.appendChild(imagePreview);
                imgdiv.appendChild(removebtn);
                document.getElementById('imagesdiv').appendChild(imgdiv);
            })
        }

    useEffect(() => {
        console.log("useEffect ran")
        // Get all images from firebase storage
        fetchImages();
    }, [])

    useEffect(() => {
        console.log("final files now: ", finalfiles)
        document.getElementById('imagesdiv').innerHTML = '';
        Array.from(finalfiles).forEach(async (image) => {
            if (typeof image === 'string') {
                if (!finalfiles.includes(image)) {
                    await fetchImages();
                }
            } else {
                const reader = new FileReader();

                reader.onload = async (e2) => {
                    const imgdiv = document.createElement('div');
                    imgdiv.className = 'imgdiv';
                    const imagePreview = document.createElement('img');
                    imagePreview.src = e2.target.result;
                    // add a button with className="btn btn-outline-red my-2 my-sm-0" to remove the image
                    const removebtn = document.createElement('button');
                    removebtn.className = 'btn btn-outline-red my-2 my-sm-0';
                    removebtn.innerHTML = 'Remove';
                    removebtn.onclick = (e) => {
                        e.preventDefault();
                        // remove the image from the array
                        const newfiles = Array.from(finalfiles).filter((file) => file !== image);
                        setFinalfiles(newfiles);
                    }
                    imgdiv.appendChild(imagePreview);
                    imgdiv.appendChild(removebtn);
                    document.getElementById('imagesdiv').appendChild(imgdiv);
                }

                reader.readAsDataURL(image);
            }
        })
    }, [finalfiles])

    return (
        <div>
            <h1 className='h1s'>Edit Item</h1>
            <form className="globaldiv text1" id='createitemdiv'
                onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    // if any of the fiels are empty, toast.error("Please fill out all fields"), if not, proceed
                    if (name === '' || description === '' || finalfiles.length === 0 || newused.value === '') {
                        toast.error("Please fill out all fields!", {
                            position: "top-center",
                            colored: true,
                        });
                        setLoading(false);
                    } else {
                        fetch(`${fetchlink}/updateitem`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name, price, description, newused: newused.value, userName: user.username, itemid: item._id
                            })
                        })
                            .then(res => res.json())
                            .then(async (response) => {
                                if (response.success) {
                                    // upload new images
                                    await Promise.all(Array.from(finalfiles).map(async (image) => {
                                        if (typeof image !== 'string') {
                                            const imageRef = ref(storage, `images/${item._id}/${image.name}`);
                                            await uploadBytes(imageRef, image);
                                        }
                                    }))

                                    // get all the downloadURLs of the images
                                    let images = [];
                                    const imagefolder = ref(storage, `images/${response.itemid}`);
                                    const imagesRef = await listAll(imagefolder);
                                    await Promise.all(imagesRef.items.map(async (imageRef) => {
                                        const downloadURL = await getDownloadURL(imageRef);
                                        images.push(downloadURL);
                                    }));
                                    console.log("images: ", images)

                                    // send downloadURLs to the backend
                                    fetch(`${fetchlink}/addimages`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            images, itemid: response.itemid
                                        })
                                    })
                                        .then(res2 => res2.json())
                                        .then((response2) => {
                                            if (response2.success) {
                                                toast.success("Item listed successfully!", {
                                                    position: "top-center",
                                                    colored: true,
                                                });
                                                setLoading(false);
                                                navigate("/listeditems");
                                            } else {
                                                toast.error("Error listing item!", {
                                                    position: "top-center",
                                                    colored: true,
                                                });
                                            }
                                        })
                                        .catch((err) => {
                                            console.log("err: ", err)
                                            toast.error(`Error listing item: ${err}`, {
                                                position: "top-center",
                                                colored: true,
                                            });
                                            setLoading(false);
                                        })

                                    setLoading(false);
                                    navigate("/listeditems");
                                } else {
                                    toast.error("Error listing item!", {
                                        position: "top-center",
                                        colored: true,
                                    });
                                }
                            })
                            .catch((err) => {
                                console.log("err: ", err)
                                toast.error(`Error listing item: ${err}`, {
                                    position: "top-center",
                                    colored: true,
                                });
                            })
                    };
                  }}
            >
                <div className="labeldiv">
                    <label><h4 className='text1'>Product Name:</h4></label>   
                    <input type="text" name='name' onChange={e => setName(e.target.value)} value={name} />
                </div>
                <div className="labeldiv">
                    <label>Price</label>
                    <input type="number" name='price' step='0.01' onChange={e => setPrice(e.target.value)} value={price} />
                </div>
                <div className="labeldiv" id='newuseddiv'>
                    <label>New/Used</label>
                    <Select options={options} onChange={(val) => setNewused(val)} value={newused} />
                </div>
                <div className="labeldiv" id='createimagediv'>
                    <label>Image</label>
                    {/* upload button for multiple images */}
                    <input type="file" name='images' multiple onChange={(e) => setFinalfiles([...finalfiles, ...e.target.files])} />
                    <div id="imagesdiv">
                        {/* firebase images will go here */}
                    </div>
                </div>
                <div className="labeldiv" id='descriptiondiv'>
                    <label>Description</label>
                    <textarea name='description' style={{border: '2px solid gray', borderRadius: '8px'}}
                        value={description} onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <input type="submit" className='btn btn-outline-success my-2 my-sm-0' value={loading ? 'Loading...' : 'Update Item'} />
                <button className='btn btn-outline-red my-2 my-sm-0' disabled={loading}
                    onClick={async (e) => {
                        e.preventDefault();
                        fetch(`${fetchlink}/deleteitem?itemid=${item._id}`)
                            .then(res => res.json())
                            .then((response) => {
                                if (response.success) {
                                    toast.success("Item deleted successfully!", {
                                        position: "top-center",
                                        colored: true,
                                    });
                                    navigate("/listeditems");
                                } else {
                                    toast.error("Error deleting item!", {
                                        position: "top-center",
                                        colored: true,
                                    });
                                }
                            })
                            .catch((err) => {
                                toast.error(`Error deleting item: ${err}`, {
                                    position: "top-center",
                                    colored: true,
                                });
                            })
                    }}
                >
                    {loading ? 'Loading...' : 'Delete Item'}
                </button>
            </form>
        </div>
    )
}