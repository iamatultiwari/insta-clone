import React, { useEffect, useState } from 'react'
import "../styles/Profile.css"
import { useParams, useNavigate } from 'react-router-dom'

let base_uri = process.env.REACT_APP_BASE_URL

export default function UserProfile() {

    const picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"

    const { userid } = useParams()
    const navigate = useNavigate()

    const loggedUser = JSON.parse(localStorage.getItem("user"))

    const [isFollow, setIsFollow] = useState(false)
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])

    // ================= FOLLOW USER =================
    const followUser = () => {
        fetch(`${base_uri}/follow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        })
        .then(res => res.json())
        .then(() => {
            setIsFollow(true)
        })
        .catch(err => console.log(err))
    }

    // ================= UNFOLLOW USER =================
    const unfollowUser = () => {
        fetch(`${base_uri}/unfollow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        })
        .then(res => res.json())
        .then(() => {
            setIsFollow(false)
        })
        .catch(err => console.log(err))
    }

    // ================= START CHAT =================
    const startChat = () => {
        fetch(`${base_uri}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                userId: userid
            })
        })
        .then(res => res.json())
        .then(chat => {
            navigate(`/chat/${chat._id}`)
        })
        .catch(err => console.log(err))
    }

    // ================= FETCH USER PROFILE =================
    useEffect(() => {
        fetch(`${base_uri}/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setUser(result.user)
            setPosts(result.post)

            if (
                result.user.followers.includes(loggedUser._id)
            ) {
                setIsFollow(true)
            }
        })
        .catch(err => console.log(err))
    }, [userid])

    return (
        <div className="profile">

            {/* ================= PROFILE HEADER ================= */}
            <div className="profile-frame">

                <div className="profile-pic">
                    <img
                        src={user?.Photo || picLink}
                        alt="profile"
                    />
                </div>

                <div className="profile-data">

                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <h1>{user?.name}</h1>

                        {/* SHOW BUTTONS ONLY IF NOT LOGGED USER */}
                        {userid !== loggedUser._id && (
                            <>
                                <button
                                    className="followBtn"
                                    onClick={isFollow ? unfollowUser : followUser}
                                >
                                    {isFollow ? "Unfollow" : "Follow"}
                                </button>

                                <button
                                    className="followBtn"
                                    style={{ backgroundColor: "#0095f6" }}
                                    onClick={startChat}
                                >
                                    Message
                                </button>
                            </>
                        )}
                    </div>

                    <div className="profile-info">
                        <p>{posts.length} posts</p>
                        <p>{user?.followers?.length || 0} followers</p>
                        <p>{user?.following?.length || 0} following</p>
                    </div>

                </div>
            </div>

            <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />

            {/* ================= GALLERY ================= */}
            <div className="gallery">
                {posts.map(pics => (
                    <img
                        className="item"
                        key={pics._id}
                        src={pics.photo}
                        alt="post"
                    />
                ))}
            </div>

        </div>
    )
}
