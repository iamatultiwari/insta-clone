import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import "../styles/Home.css"

let base_uri = process.env.REACT_APP_BASE_URL

export default function MyFollowingPost() {

    const navigate = useNavigate()
    const picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"

    const [data, setData] = useState([])
    const [comment, setComment] = useState("")
    const [show, setShow] = useState(false)
    const [item, setItem] = useState({})

    const notifyA = (msg) => toast.success(msg)

    useEffect(() => {
        const token = localStorage.getItem("jwt")
        if(!token){
            navigate('/signin')
            return
        }

        fetch(`${base_uri}/myfollowingpost`, {
            method: "get",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": "Bearer " + token
            }
        })
        .then(res => res.json())
        .then(result => {
            // Ensure result is an array
            if(Array.isArray(result)){
                setData(result)
            } else {
                setData([])  // fallback to empty array
                console.warn("Expected array but got:", result)
            }
        })
        .catch(err => {
            console.log(err)
            setData([])
        })
    }, [navigate])

    const toggleComment = (posts) => {
        if(show){
            setShow(false)
            setItem({})
        } else {
            setShow(true)
            setItem(posts)
        }
    }

    const likePost = (id) => {
        fetch(`${base_uri}/like`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(result => {
            if(!result || !result._id) return
            const newData = data.map(post => post._id === result._id ? result : post)
            setData(newData)
        })
    }

    const unlikePost = (id) => {
        fetch(`${base_uri}/unlike`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(result => {
            if(!result || !result._id) return
            const newData = data.map(post => post._id === result._id ? result : post)
            setData(newData)
        })
    }

    const makeComment = (text, id) => {
        if(!text) return
        fetch(`${base_uri}/comment`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({ text, postId: id })
        })
        .then(res => res.json())
        .then(result => {
            if(!result || !result._id) return
            const newData = data.map(post => post._id === result._id ? result : post)
            setData(newData)
            setComment("")
            notifyA("Comment Posted")
        })
    }

    // Safe localStorage user
    const currentUser = JSON.parse(localStorage.getItem("user")) || {}

    return (
        <div className="home">
            {Array.isArray(data) && data.length > 0 ? (
                data.map(posts => (
                    <div className="card" key={posts._id}>
                        <div className="card-header">
                            <div className="card-pic">
                                <img src={posts.postedBy?.Photo || picLink} alt="" />
                            </div>
                            <Link to={`/profile/${posts.postedBy?._id}`}>
                                <h5>{posts.postedBy?.name || "User"}</h5>
                            </Link>
                        </div>

                        <div className="card-image">
                            <img src={posts.photo} alt="" />
                        </div>

                        <div className="card-content">
                            {posts.likes?.includes(currentUser._id) ? (
                                <span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => unlikePost(posts._id)}>favorite</span>
                            ) : (
                                <span className="material-symbols-outlined" onClick={() => likePost(posts._id)}>favorite</span>
                            )}
                            <p className='likes'>{posts.likes?.length || 0} likes</p>
                            <p className='body-text'><span className='body-name'>{posts.postedBy?.name || "User"}</span> {posts.body}</p>
                            <p style={{fontWeight: "550", fontSize: "16px", cursor: "pointer"}} onClick={() => toggleComment(posts)}>View all comments</p>
                        </div>

                        <div className="add-comment">
                            <input type="text" placeholder='Add a comment' value={comment} onChange={(e)=> setComment(e.target.value)} />
                            <button className="comment" onClick={() => makeComment(comment, posts._id)}>Post</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts to display.</p>
            )}

            {show && item && (
                <div className="showComment">
                    <div className="container">
                        <div className="postPic">
                            <img src={item.photo} alt="" />
                        </div>
                        <div className="details">
                            <div className="card-header" style={{borderBottom: "1px solid #00000029"}}>
                                <div className="card-pic">
                                    <img src={item.postedBy?.Photo || picLink} alt="" />
                                </div>
                                <h5>{item.postedBy?.name || "User"}</h5>
                            </div>
                            <div className="comment-section" style={{borderBottom: "1px solid #00000029"}}>
                                {Array.isArray(item.comments) && item.comments.map(comment => (
                                    <p className="comm" key={comment._id}>
                                        <span className="commenter" style={{fontWeight: "bolder"}}>{comment.postedBy?.name || "User"}</span>
                                        <span className="commentText">{comment.comment}</span>
                                    </p>
                                ))}
                            </div>
                            <div className="card-content">
                                <p>{item.likes?.length || 0} likes</p>
                                <p>{item.body}</p>
                            </div>
                            <div className="add-comment">
                                <span className="material-symbols-outlined">mood</span>
                                <input type="text" placeholder='Add a comment' value={comment} onChange={(e)=> setComment(e.target.value)} />
                                <button className="comment" onClick={()=> {makeComment(comment, item._id); toggleComment()}}>Post</button>
                            </div>
                        </div>
                    </div>
                    <div className="close-comment" onClick={() => toggleComment()}>
                        <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
                    </div>
                </div>
            )}
        </div>
    )
}
