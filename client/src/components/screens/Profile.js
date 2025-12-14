import React, { useEffect, useState } from 'react';
import PostDetail from './PostDetail';
import ProfilePic from './ProfilePic';
import "../styles/Profile.css";

const base_uri = process.env.REACT_APP_BASE_URL;

export default function Profile() {
    const picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

    const [show, setShow] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const [changePic, setChangePic] = useState(false);
    const [loggedUser, setLoggedUser] = useState({});

    const toggleDetails = (post) => {
        setSelectedPost(post);
        setShow(!show);
    };

    const changeProfile = () => {
        setChangePic(!changePic);
    };

    const handleFollow = (follow) => {
        const url = follow ? `${base_uri}/follow` : `${base_uri}/unfollow`;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ followId: user._id }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return console.error(data.error);
            setUser(prev => ({
                ...prev,
                followers: follow
                    ? [...(prev.followers || []), loggedUser._id]
                    : (prev.followers || []).filter(id => id !== loggedUser._id),
            }));
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;
        setLoggedUser(storedUser);

        const token = localStorage.getItem("jwt");
        if (!token) return;

        fetch(`${base_uri}/user/${storedUser._id}`, {
            headers: { "Authorization": "Bearer " + token },
        })
        .then(res => res.json())
        .then(result => {
            setUser(result.user || {});
            setPosts(Array.isArray(result.post) ? result.post : []);
        })
        .catch(err => console.error(err));
    }, []);

    const isFollowing = (user.followers || []).includes(loggedUser._id);

    return (
        <div className="profile">
            <div className="profile-frame">
                <div className="profile-pic">
                    <img onClick={changeProfile} src={user?.Photo || picLink} alt="Profile" />
                </div>

                <div className="profile-data">
                    <h1>{user?.name || loggedUser.name}</h1>

                    {user?.bio && <p className="profile-bio">{user.bio}</p>}

                    {loggedUser._id !== user._id && (
                        <button className="followBtn" onClick={() => handleFollow(!isFollowing)}>
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                    )}

                    <div className="profile-info" style={{ display: "flex" }}>
                        <p>{posts.length} posts</p>
                        <p>{user?.followers?.length || 0} followers</p>
                        <p>{user?.following?.length || 0} following</p>
                    </div>
                </div>
            </div>

            <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />

            <div className="gallery">
                {posts.map(p => (
                    <img className="item" key={p._id} src={p.photo} alt="Post" onClick={() => toggleDetails(p)} />
                ))}
            </div>

            {show && selectedPost && (
                <PostDetail item={selectedPost} user={user} toggleDetails={toggleDetails} />
            )}

            {changePic && <ProfilePic changeProfile={changeProfile} />}
        </div>
    );
}
