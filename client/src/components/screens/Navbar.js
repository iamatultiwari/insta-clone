import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../images/insta_logo.png'
import { LoginContext } from '../../context/LoginState'
import "../styles/Navbar.css"

const base_uri = process.env.REACT_APP_BASE_URL

export default function Navbar() {
    const navigate = useNavigate()
    const { setModalOpen } = useContext(LoginContext)
    const [search, setSearch] = useState("")
    const [userResults, setUserResults] = useState([])

    // 🔹 Search users dynamically
    const handleSearch = (query) => {
        setSearch(query)
        if (query.trim() === "") {
            setUserResults([])
            return
        }

        fetch(`${base_uri}/search-users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ query })
        })
        .then(res => res.json())
        .then(result => {
            setUserResults(result.users || [])
        })
        .catch(err => console.error(err))
    }

    return (
        <>
            {localStorage.getItem("jwt") ? (
                <div className="navbar">
                    <div className="logo-div">
                        <img src={logo} className='logo-img' alt="Logo" onClick={() => navigate('/')} />
                    </div>

                    {/* Search bar */}
                    <div className="search-div">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {userResults.length > 0 && (
                            <div className="search-results">
                                {userResults.map(user => (
                                    <p key={user._id} onClick={() => {
                                        navigate(`/profile/${user._id}`)
                                        setSearch("")
                                        setUserResults([])
                                    }}>
                                        {user.name} ({user.userName})
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <ul className="nav-items">
                        <Link to="/profile"><li>Profile</li></Link>
                        <Link to="/createPost"><li>Create Post</li></Link>
                        <Link to="/followingpost" style={{ marginLeft: '20px' }}><li>My Followings</li></Link>

                        <Link to={""}>
                            <button className="primaryBtn" onClick={() => { setModalOpen(true) }}>
                                Log Out
                            </button>
                        </Link>
                    </ul>
                </div>
            ) : null}

            {/* Mobile Nav */}
            <ul className="nav-mobile">
                {localStorage.getItem("jwt") ? (
                    <>
                        <Link to='/'><li><span className="material-symbols-outlined">home</span></li></Link>
                        <Link to='/profile'><li><span className="material-symbols-outlined">account_circle</span></li></Link>
                        <Link to='/createPost'><li><span className="material-symbols-outlined">add_circle</span></li></Link>
                        <Link to='/followingpost'><li><span className="material-symbols-outlined">explore</span></li></Link>
                        <Link to={""}>
                            <li className="primaryBtn" onClick={() => { setModalOpen(true) }}>
                                <span className="material-symbols-outlined">logout</span>
                            </li>
                        </Link>
                    </>
                ) : null}
            </ul>
        </>
    )
}
