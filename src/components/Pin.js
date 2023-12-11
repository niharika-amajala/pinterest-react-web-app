import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar'; // Import the Avatar component

import * as client from './client';

// Placeholder image for the dummy profile icon
const placeholderImage = './images/profile.png';

// User icon SVG
const UserIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#000000">
    {/* Add the SVG path data here */}
  </svg>
);

const profileUserId = "user123";


function Pin({ urls, profileIcon }) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);

  const handleImageClick = async () => {
    if (!urls.docId) {
      urls = await client.imageUploadUnsplash({ docId: urls.regular });
    }

    if (isAuthenticated && urls.regular) {
      navigate(`/details?docId=${urls?.regular}&postId=${urls.id}&postUserId=${urls.userId}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <Wrapper>
      <Container>
        <ClickableImage onClick={handleImageClick}>
          <img src={urls?.regular} alt="pin" />
        </ClickableImage>
      </Container>
    </Wrapper>
  );
}

export default Pin;

const Wrapper = styled.div`
  display: inline-flex;
  padding: 8px;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 236px;
`;

const ClickableImage = styled.div`
  cursor: pointer;

  img {
    display: flex;
    width: 100%;
    border-radius: 16px;
    object-fit: cover;
  }
`;

const ClickableProfileIcon = styled.div`
  cursor: pointer;
  margin-top: 8px; // Adjust the spacing as needed
`;

const DummyProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #f0f0f0; // Light color matching white background
  border-radius: 50%;
  margin-top: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

