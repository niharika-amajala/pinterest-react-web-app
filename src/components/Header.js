import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PinterestIcon from '@material-ui/icons/Pinterest';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FaceIcon from '@material-ui/icons/Face';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useDispatch } from 'react-redux';
import { destroyToken } from '../authReducer';

function Header({ onSearchSubmit }) {
  const [input, setInput] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(input);
    setInput('');
    navigate('/mainboard');
  };

  const handleSignout = () => {
    dispatch(destroyToken());
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

      <HomePageButton>
        <Link to="/mainboard">Homepage</Link>
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
        <IconButton onClick={goToProfile}>
          <FaceIcon />
        </IconButton>
        <IconButton>
          {/* Add a Link to the desired page where you want to handle the "plus" action */}
          <Link to="/add">
            {/* You can use any icon for the plus button, I'm using a simple + sign for demonstration */}
            <span style={{ fontSize: 28, fontWeight: 'bold' }}>+</span>
          </Link>
        </IconButton>
        <LogoutButton onClick={handleSignout}>Logout</LogoutButton>
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

const SearchWrapper = styled.div`
  flex: 1;
`;

const SearchBarWrapper = styled.div`
  background-color: #efefef;
  display: flex;
  height: 48px;
  width: 100%;
  border-radius: 50px;
  border: none;
  padding-left: 10px;

  form {
    display: flex;
    flex: 1;
  }
  form > input {
    background-color: transparent;
    border: none;
    width: 100%;
    margin-left: 5px;
    font-size: 16px;
  }
  form > button {
    display: none;
  }

  input:focus {
    outline: none;
  }
  
`;

const IconsWrapper = styled.div``;
const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #000;
  font-weight: bold;
`;
