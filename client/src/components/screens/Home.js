import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/Home.css";

const base_uri = process.env.REACT_APP_BASE_URL;

export default function Home() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

    const notifyA = (msg) => toast.success(msg);
    const notifyB = (msg) => toast.error(msg);

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    // Fetch all posts
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate('/signin');
            return;
        }

        fetch(`${base_uri}/allPosts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
            if(res.status === 401){
                localStorage.clear();
                navigate('/signin');
                return null;
            }
            return res.json();
        })
        .then(result => {
            if(!result) return;
            setPosts(result); // backend returns array of posts
        })
        .catch(err => {
            console.error("Error fetching posts:", err);
            notifyB("Failed to load posts");
        });
    }, [navigate]);

    // Toggle comments modal
    const toggleComments = (post = null) => {
        setShowComments(!showComments);
        setSelectedPost(post);
    };

    // Like a post
    const likePost = (id) => {
        fetch(`${base_uri}/like`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(updatedPost => {
            setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
        })
        .catch(err => console.log(err));
    };

    // Unlike a post
    const unlikePost = (id) => {
        fetch(`${base_uri}/unlike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(updatedPost => {
            setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
        })
        .catch(err => console.log(err));
    };

    // Add comment
    const makeComment = (text, id) => {
        if(!text) return;
        fetch(`${base_uri}/comment`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ text, postId: id })
        })
        .then(res => res.json())
        .then(updatedPost => {
            setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
            setComment("");
            notifyA("Comment added");
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="home">
            {posts.length > 0 ? posts.map(post => (
                <div className="card" key={post._id}>
                    {/* Header */}
                    <div className="card-header">
                        <div className="card-pic">
                            <img src={post.postedBy?.Photo || picLink} alt="" />
                        </div>
                        <Link to={`/profile/${post.postedBy?._id}`}>
                            <h5>{post.postedBy?.name}</h5>
                        </Link>
                    </div>

                    {/* Post Image */}
                    <div className="card-image">
                        <img src={post.photo} alt="" />
                    </div>

                    {/* Post Content */}
                    <div className="card-content">
                        {loggedUser && post.likes.includes(loggedUser._id) ? (
                            <span className="material-symbols-outlined material-symbols-outlined-red"
                                onClick={() => unlikePost(post._id)}>favorite</span>
                        ) : (
                            <span className="material-symbols-outlined"
                                onClick={() => likePost(post._id)}>favorite</span>
                        )}

                        <p className="likes">{post.likes.length} likes</p>
                        <p className="body-text"><span className="body-name">{post.postedBy?.name}</span> {post.body}</p>
                        <p className="view-comments" onClick={() => toggleComments(post)}>View all comments</p>
                    </div>

                    {/* Add comment */}
                    <div className="add-comment">
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <button onClick={() => makeComment(comment, post._id)}>Post</button>
                    </div>
                </div>
            )) : (
                <p>No posts available</p>
            )}

            {/* Comment Modal */}
            {showComments && selectedPost && (
                <div className="showComment">
                    <div className="container">
                        <div className="postPic">
                            <img src={selectedPost.photo} alt="" />
                        </div>
                        <div className="details">
                            <div className="card-header">
                                <div className="card-pic">
                                    <img src={selectedPost.postedBy?.Photo || picLink} alt="" />
                                </div>
                                <h5>{selectedPost.postedBy?.name}</h5>
                            </div>

                            <div className="comment-section">
                                {selectedPost.comments?.map(c => (
                                    <p key={c._id}><b>{c.postedBy?.name}</b> {c.comment}</p>
                                ))}
                            </div>

                            <div className="add-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                                <button onClick={() => { makeComment(comment, selectedPost._id); toggleComments(); }}>Post</button>
                            </div>
                        </div>
                    </div>
                    <span className="close-comment" onClick={() => toggleComments()}>✖</span>
                </div>
            )}
        </div>
    );
}
