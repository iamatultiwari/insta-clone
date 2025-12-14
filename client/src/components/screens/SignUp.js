import React, { useEffect, useState } from 'react';
import '../styles/SignUp.css';
import logo from '../../images/insta_logo.png';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const base_uri = process.env.REACT_APP_BASE_URL; // Make sure this is set in your React .env file

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // Regex validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  // Toast functions
  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const postUser = async () => {
    // Client-side validation
    if (!emailRegex.test(email)) {
      notifyError('Invalid email format');
      return;
    }

    if (!passwordRegex.test(password)) {
      notifyError(
        'Password must contain 6-16 chars, numbers, special chars, upper and lowercase letters'
      );
      return;
    }

    // Ensure base_uri is defined
    if (!base_uri) {
      notifyError('Backend URL is not defined. Check your .env file.');
      console.error('REACT_APP_BASE_URL is undefined');
      return;
    }

    try {
      console.log('Sending signup request to:', `${base_uri}/signup`);
      const response = await fetch(`${base_uri}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, userName, password }),
      });

      console.log('HTTP status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        // Server returned an error
        notifyError(data.error || 'Signup failed');
        return;
      }

      notifySuccess(data.message || 'Signup successful');
      navigate('/signin');
    } catch (err) {
      console.error('Fetch error:', err);
      notifyError('Failed to connect to server');
    }
  };

  return (
    <div className="box">
      <div className="signUp-box">
        <img className="logo-img" src={logo} alt="logo" />
        <div className="form-container">
          <p className="signUp-para">Sign up to see photos and videos from your friends.</p>
          <div className="input-div">
            <input
              type="email"
              className="input-fields"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-div">
            <input
              type="text"
              className="input-fields"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-div">
            <input
              type="text"
              className="input-fields"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="input-div">
            <input
              type="text"
              className="input-fields"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="pp-text">
            By signing up, you agree to our Terms, Privacy Policy, and Cookies Policy.
          </div>
          <div className="button-div">
            <button className="button-65" role="button" onClick={postUser}>
              Sign up
            </button>
          </div>
        </div>
      </div>
      <div className="have-acc">
        <p className="have-acc-text">
          Have an account?{' '}
          <Link className="link" to="/signin">
            <span className="log-in">Log in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
