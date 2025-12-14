import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/PostDetail.css";

const base_uri = process.env.REACT_APP_BASE_URL;

export default function PostDetail({ item, user, toggleDetails }) {
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState("");
    const picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

    // Toast notifications
    const notifyA = (msg) => toast.success(msg);
    const notifyB = (msg) => toast.error(msg);

    // Delete post
    const removePost = (postId) => {
        if (window.confirm("Do you really want to remove this post?")) {
            fetch(`${base_uri}/deletePost/${postId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                },
            })
                .then(res => res.json())
                .then(result => {
                    if (result.error) {
                        notifyB(result.error);
                    } else {
                        toggleDetails();
                        navigate('/');
                        notifyA(result.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    notifyB("Failed to delete post.");
                });
        }
    };

    // Add comment
    const postComment = () => {
        if (!commentText.trim()) return;

        fetch(`${base_uri}/comment/${item._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ comment: commentText }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    notifyB(data.error);
                } else {
                    notifyA("Comment added!");
                    setCommentText("");
                    // Optionally refresh post data
                    toggleDetails();
                }
            })
            .catch(err => {
                console.error(err);
                notifyB("Failed to add comment.");
            });
    };

    return (
        <div className="showComment">
            <div className="container">
                <div className="postPic">
                    <img src={item.photo} alt="" />
                </div>

                <div className="details">
                    {/* Card header */}
                    <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                        <div className="card-pic">
                            <img src={user.Photo ? user.Photo : picLink} alt="" />
                        </div>
                        <h5>{user.name}</h5>
                        <div className="deletePost">
                            <span
                                className="material-symbols-outlined"
                                onClick={() => removePost(item._id)}
                            >
                                delete
                            </span>
                        </div>
                    </div>

                    {/* Comment section */}
                    <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                        {item.comments.map((comment) => (
                            <p className="comm" key={comment._id}>
                                <span className="commenter" style={{ fontWeight: "bolder" }}>
                                    {comment.postedBy.name}{" "}
                                </span>
                                <span className="commentText">{comment.comment}</span>
                            </p>
                        ))}
                    </div>

                    {/* Card content */}
                    <div className="card-content">
                        <p>{item.likes.length} likes</p>
                        <p>{item.body}</p>
                    </div>

                    {/* Add comments */}
                    <div className="add-comment">
                        <span className="material-symbols-outlined">mood</span>
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button className="comment" onClick={postComment}>
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Close comment button */}
            <div className="close-comment" onClick={toggleDetails}>
                <span className="material-symbols-outlined material-symbols-outlined-comment">
                    close
                </span>
            </div>
        </div>
    );
}
