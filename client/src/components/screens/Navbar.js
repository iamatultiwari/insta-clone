import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../images/insta_logo.png'
import { LoginContext } from '../../context/LoginState'
import "../styles/Navbar.css"

export default function Navbar() {

    const navigate = useNavigate()
    const { setModalOpen } = useContext(LoginContext)

    return (
        <>
            {localStorage.getItem("jwt") ? (
                <div className="navbar">
                    <div className="logo-div">
                        <img src={logo} className='logo-img' alt="" onClick={() => navigate('/')} />
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
