// Registration.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerAction } from './action';
import './registration.css';

export default function Registration() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');

  // Redux state and dispatch
  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleRegister = (e) => {
    e.preventDefault();

    // Validate user role
    if (!userRole) {
      alert('Please select a user role (User or Seller).');
      return;
    }

    dispatch(registerAction({ firstName, lastName, email, password, userRole }));
  };

  return (
    <div className="login-container">
      <div className="login-card registration-card">
        <form onSubmit={handleRegister}>
          <div className="name-inputs">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="user-role-input">
            <label>
              <input
                type="radio"
                name="userRole"
                value="User"
                checked={userRole === 'User'}
                onChange={() => setUserRole('User')}
                required
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="userRole"
                value="Seller"
                checked={userRole === 'Seller'}
                onChange={() => setUserRole('Seller')}
                required
              />
              Seller
            </label>
          </div>
          <button type="submit" className="login-button registration-button">Register</button>
        </form>
        <button className="facebook-login">Continue with Facebook</button>
        <button className="google-login">Continue with Google</button>
        <div className="alternative-login">
          <p>Already registered? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
}
