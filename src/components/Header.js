// Header.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PinterestIcon from '@material-ui/icons/Pinterest';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FaceIcon from '@material-ui/icons/Face';
import SettingsIcon from '@material-ui/icons/Settings';
import { useDispatch } from 'react-redux';
import { destroyToken } from '../authReducer';
import AddIcon from '@material-ui/icons/Add';

function Header({ onSearchSubmit, isAuthenticated }) {
  const [input, setInput] = useState('');
  const [userRole, setUserRole] = useState(null);
  const profileUserId = "user123";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from local JSON file
    const fetchUserData = async () => {
      try {
        const response = await fetch('/datasets/userdata.json');
        const users = await response.json();
        const currentUser = users.find(user => user.id === profileUserId);
        if (currentUser) {
          setUserRole(currentUser.role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const goToProfile = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      // User is not logged in, show alert and redirect to login
      alert('Please login to see your profile.');
      navigate('/login');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem('lastSearchTerm');
    localStorage.removeItem('lastSearchResults');
    onSearchSubmit(input);
    setInput('');
    if (!isAuthenticated){
      navigate('/home');
    } else {
      navigate('/mainboard');
    }
  };

  const handleSignout = () => {
    dispatch(destroyToken());
    localStorage.removeItem('lastSearchTerm');
    localStorage.removeItem('lastSearchResults');
    navigate('/login');
  };

  return (
    <Wrapper>
      <LogoWrapper>
        <IconButton>
          <Link to="/mainboard">
            <PinterestIcon />
          </Link>
        </IconButton>
      </LogoWrapper>

      <ExplorePageButton>
        <Link to="/explore">Explore</Link>
      </ExplorePageButton>

      <HomePageButton>
        {isAuthenticated && (
           <Link to="/mainboard">Homepage</Link>
        )}
        {!isAuthenticated && (
           <Link to="/home">Homepage</Link>
        )}
      </HomePageButton>

      <SearchWrapper>
        <SearchBarWrapper>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <form>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit" onClick={handleSearchSubmit}></button>
          </form>
        </SearchBarWrapper>
      </SearchWrapper>

      <IconsWrapper>
        {userRole === 'admin' && isAuthenticated && (
          <StyledIconButton component={Link} to="/admin-dashboard">
            <SettingsIcon />
          </StyledIconButton>
        )}
        {isAuthenticated && (
          <>
            <StyledIconButton onClick={goToProfile}>
              <FaceIcon />
            </StyledIconButton>
            <StyledIconButton component={Link} to="/add">
              <AddIcon />
            </StyledIconButton>
            <LogoutButton onClick={handleSignout}>Logout</LogoutButton>
          </>
        )}
        {!isAuthenticated && (
          <div className="nav-right">
          <StyledLink href="/login" className="nav-item btn btn-login">Login</StyledLink>
          <StyledLink href="/signup" className="nav-item btn btn-signup">Sign up</StyledLink>
        </div>
        )}
      </IconsWrapper>
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 12px 4px 4px 16px;
  background-color: white;
  color: black;
`;

const StyledLink = styled.a`
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-weight: 700;
  color: black;
  margin-right: 1rem;
  border-radius: 24px;
  font-weight: bold;
  background-color: ${props => props.className.includes('btn-login') ? '#e60023' : '#efefef'};
  color: ${props => props.className.includes('btn-login') ? 'white' : 'black'};
`;

const LogoWrapper = styled.div`
  .MuiSvgIcon-root {
    color: #e60023;
    font-size: 32px;
    cursor: pointer;
  }
`;

const HomeButtons = styled.div`
  display: flex;
  height: 48px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
`;

const HomePageButton = styled(HomeButtons)`
  background-color: black;

  a {
    text-decoration: none;
    color: white;
    font-weight: 700;
  }
`;

const ExplorePageButton = styled(HomeButtons)`
  a {
    text-decoration: none;
    color: black;
    font-weight: 700;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
`;

const SearchBarWrapper = styled.div`
  background-color: #efefef;
  display: flex;
  align-items: center;
  height: 48px;
  width: 100%;
  border-radius: 50px;
  border: none;
  padding-left: 10px;

  form {
    display: flex;
    flex: 1;
    align-items: center;
  }
  form > input {
    background-color: transparent;
    border: none;
    width: 100%;
    margin-left: 10px; /* Adjusted margin for the cursor position */
    margin-top: 15px;   /* Added margin-top to move the cursor below */
    font-size: 16px;
  }
  form > button {
    display: none;
  }

  input:focus {
    outline: none;
  }
`;



const IconsWrapper = styled.div`
  padding: 15px;
`;

const StyledIconButton = styled(IconButton)`
  &:hover{
    background: #E60023 !important;
    color: white; 
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #000;
  font-weight: bold;

  &:hover,
  &:active {
    background: #E60023;
    color: white; 
  }
`;
