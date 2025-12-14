import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoginContext } from '../../context/LoginState'
import "../styles/CreatePost.css"

let base_uri = process.env.REACT_APP_BASE_URL;

export default function CreatePost() {

    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const navigate = useNavigate()
    const picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"

    const { loggedUser } = useContext(LoginContext)

    // Toast functions
    const notifyA = (msg) => toast.success(msg)
    const notifyB = (msg) => toast.error(msg)
    
    // Save post to MongoDB when 'url' changes
    useEffect(() => {
        if(url){
            fetch(`${base_uri}/createPost`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            })
            .then(res => res.json())
            .then((data) => {
                if(data.error){
                    notifyB(data.error)
                } else {
                    notifyA("Successfully Posted")
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
        }
    }, [url, body, navigate])

    // Upload image to Cloudinary
    const postDetails = () => {
        if(!image){
            notifyB("Please select an image")
            return
        }
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagram")
        data.append("cloud_name", "vishalranjan")

        fetch("https://api.cloudinary.com/v1_1/vishalranjan/image/upload", {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => setUrl(data.url))
        .catch(err => console.log(err))
    }

    const loadfile = (event) => {
        const output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0])
        output.onload = function(){
            URL.revokeObjectURL(output.src)
        }
    }

    // Safe access to user info
    const currentUser = loggedUser || JSON.parse(localStorage.getItem("user")) || {}

    return (
        <div className='createPost'>
            {/* header */}
            <div className="post-header">
                <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
                <button id='post-btn' onClick={postDetails}>Share</button>
            </div>

            {/* image preview */}
            <div className="main-div">
                <img src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png" alt="" id='output' />
                <input type="file" accept='image/*'
                    onChange={(event)=>{
                        loadfile(event)
                        setImage(event.target.files[0])
                    }}
                />
            </div>

            {/* details */}
            <div className="details">
                <div className="card-header">
                    <div className="card-pic">
                        <img className='card-img' src={currentUser.Photo || picLink} alt="" />
                        <h5>{currentUser.name || "User"}</h5>
                    </div>
                </div>
                <textarea 
                    placeholder='Write a caption'
                    value={body}
                    onChange={(e)=> setBody(e.target.value)}
                />
            </div>
        </div>
    )
}
