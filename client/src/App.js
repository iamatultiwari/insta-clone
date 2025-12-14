import { useContext, useEffect } from 'react';
import './App.css';
import Home from './components/screens/Home';
import Navbar from './components/screens/Navbar';
import SignIn from './components/screens/SignIn';
import SignUp from './components/screens/SignUp';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from './context/LoginState';
import Modal from './components/screens/Modal';
import CreatePost from './components/screens/CreatePost';
import Profile from './components/screens/Profile';
import MyFollowingPost from './components/screens/MyFollowingPost';
import UserProfile from './components/screens/UserProfile';
let base_uri = process.env.REACT_APP_BASE_URL;

function App() {

  const {modalOpen} = useContext(LoginContext)
  const {loggedUser, setLoggedUser} = useContext(LoginContext)

  useEffect(()=>{
    if(localStorage.getItem("user")){
      fetch(`${base_uri}/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
        headers: {
          "Authorization": "Bearer "+localStorage.getItem("jwt")
        }
      }).then(res => res.json())
      .then((result)=>{
        setLoggedUser(result.user)
      })
    }
  }, [loggedUser ? loggedUser.Photo : [] ])

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/createPost' element={<CreatePost/>} />
        <Route exact path='/profile' element={<Profile/>} />
        <Route path='/followingpost' element={<MyFollowingPost/>} />
        <Route path='/profile/:userid' element={<UserProfile/>} />
      </Routes>
      <ToastContainer theme='dark' />
      {modalOpen && <Modal/>}
    </BrowserRouter>
  );
}

export default App;
