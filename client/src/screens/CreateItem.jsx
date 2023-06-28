import { useContext, useState, useEffect } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext, fetchlink } from '../App'
import { storage } from '../firebase.js'
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import '../assets/css/createitem.css'

export default function CreateItem() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [newused, setNewused] = useState('new')
    const [finalfiles, setFinalfiles] = useState([])
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const options = [
        {value: 'Brand New', label: 'Brand New'},
        {value: 'Open Box', label: 'Open Box'},
        {value: 'Used', label: 'Used'},
        {value: 'Refurbished', label: 'Refurbished'}
    ]

    useEffect(() => {
        // Clear existing images
        document.getElementById('imagesdiv').innerHTML = '';

        Array.from(finalfiles).forEach(async (image) => {
            const reader = new FileReader();

            reader.onload = async (e2) => {
                const imagePreview = document.createElement('img');
                imagePreview.src = e2.target.result;
                document.getElementById('imagesdiv').appendChild(imagePreview);
            }

            reader.readAsDataURL(image);
        })
    }, [finalfiles])

    return (
        <div>
            <h1 className='h1s'>Create Item</h1>
            <iframe name="dummyframe" id="dummyframe" style={{display: "none"}}></iframe>
            <form className="globaldiv text1" id='createitemdiv' encType="multipart/form-data"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    // if any of the fiels are empty, toast.error("Please fill out all fields"), if not, proceed
                    if (name === '' || price === 0 || description === '' || finalfiles.length === 0 || newused.value === '') {
                        toast.error("Please fill out all fields!", {
                            position: "top-center",
                            colored: true,
                        });
                    } else {
                        fetch(`${fetchlink}/createitem`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name, price, description, newused: newused.value, userName: user.username
                            })
                        })
                            .then(res => res.json())
                            .then(async (response) => {
                                if (response.success) {
                                    // upload all the images to images/item._id folder in firebase storage
                                    await Promise.all(Array.from(finalfiles).map(async (file) => {
                                        try {
                                            await uploadBytes(ref(storage, `images/${response.item._id}/${file.name}`), file)
                                        } catch(error) {
                                            return;
                                        }
                                    }))

                                    // get all the downloadURLs of the images
                                    let images = [];
                                    const imagefolder = ref(storage, `images/${response.item._id}`);
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
                                            images, itemid: response.item._id
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
                                            console.log(err)
                                            toast.error(`Error listing item: ${err}`, {
                                                position: "top-center",
                                                colored: true,
                                            });
                                            setLoading(false);
                                        })
                                } else {
                                    toast.error("Error listing item!", {
                                        position: "top-center",
                                        colored: true,
                                    });
                                    setLoading(false);
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                toast.error(`Error listing item: ${err}`, {
                                    position: "top-center",
                                    colored: true,
                                });
                                setLoading(false);
                            })
                    };
                  }}
            >
                <div className="labeldiv">
                    <label><h4 className='text1'>Product Name:</h4></label>   
                    <input type="text" name='name' onChange={e => setName(e.target.value)} />
                </div>
                <div className="labeldiv">
                    <label>Price</label>
                    <input type="number" name='price' step='0.01' onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="labeldiv" id='newuseddiv'>
                    <label>New/Used</label>
                    <Select options={options} onChange={(val) => setNewused(val)} />
                </div>
                <div className="labeldiv" id='createimagediv'>
                    <label>Image</label>
                    {/* upload button for multiple images */}
                    <input type="file" name='images' multiple onChange={(e) => setFinalfiles(e.target.files)} accept='image/*' />
                    <div id="imagesdiv"></div>
                </div>
                <div className="labeldiv" id='descriptiondiv'>
                    <label>Description</label>
                    <textarea name='description' style={{border: '2px solid gray', borderRadius: '8px'}}
                        value={description} onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <input type="submit" className='btn btn-outline-success my-2 my-sm-0' value={loading ? 'Loading...' : 'List Item'} />
            </form>
        </div>
    )
}