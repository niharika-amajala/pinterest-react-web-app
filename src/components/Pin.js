import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import * as client from './client';

// Placeholder image for the dummy profile icon
const placeholderImage = './images/profile.png';

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
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    // Add logic to navigate to the profile page when the profile icon is clicked
    navigate("/profile");
  };

  return (
    <Wrapper>
      <Container>
        <ClickableImage onClick={handleImageClick}>
          <img src={urls?.regular} alt="pin" />
        </ClickableImage>
        {profileIcon ? (
          <ClickableProfileIcon onClick={handleProfileClick}>
            <ProfileIcon src={profileIcon} alt="profile" />
          </ClickableProfileIcon>
        ) : (
          <DummyProfileIcon
            alt="dummy-profile"
            onClick={handleProfileClick}
          />
        )}
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

const ProfileIcon = styled.img`
  width: 40px;  // Adjust the size as needed
  height: 40px; // Adjust the size as needed
  border-radius: 50%;
`;

const DummyProfileIcon = styled.div`
  width: 32px;  // Adjust the size as needed
  height: 32px; // Adjust the size as needed
  background-color: #ccc; // Adjust the background color as needed
  border-radius: 50%;
  margin-top: 8px; // Adjust the spacing as needed
  cursor: pointer; // Add cursor style to indicate clickability
  background-image: url(${placeholderImage});
  background-size: cover;
`;
