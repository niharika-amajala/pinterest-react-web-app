// UserProfile.js
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import UserPins from './userPins'
import * as client from "./client";
import SellerItems from '../Seller/SellerItems';
import {Link, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import BlurredLoginPrompt from './BlurredPrompt';
import Spinner from "./Spinner";

function UserProfile() {
  const {profileUserId} = useParams();

  const authToken = useSelector((state) => state.authReducer.token);

  const [userData, setUserData] = useState({});
  const [createdPosts, setCreatedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [userId, setUserId] = useState();
  const [removeInfo, setRemoveInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSeller = userData.role === 'seller';

  let isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      let id;
      if (authToken) {
        const decoded = jwtDecode(authToken);
        id = decoded.id;
      } else {
        id = 18; // Default ID
      }
      setUserId(id);

      if (profileUserId) {
        if (id !== parseInt(profileUserId)) {
          setRemoveInfo(true);
        }
        id = profileUserId;
      }

      try {
        const profile = await client.profile(id);
        const createdPostsData = await client.postsCreatedByUser(id);
        const savedPostsData = await client.postsSavedByUser(id);
        if (!isAuthenticated) {
          profile.email = "";
        }
        setUserData(profile);
        setCreatedPosts(createdPostsData);
        setSavedPosts(savedPostsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [profileUserId, authToken, isAuthenticated]);

  if (isLoading) {
    return <Spinner message="Loading profile..." />;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <AvatarContainer>
        <StyledAvatar src={userData.profilePicture} />
        <UserName>{userData.firstName + ' ' + userData.lastName}</UserName>
        <Email>{userData.email}</Email>
        <FollowInfo>
          <span>{userData.followers} Followers</span>
          <span>{userData.following} Following</span>
        </FollowInfo>
        {(authToken && !removeInfo) && (
            <ButtonContainer>
              <StyledButton variant="outlined" color="primary">
                <Link to={`/passwordEdit/${userId}`} style={{textDecoration: "none", color: "inherit"}}>
                  Update password
                </Link>
              </StyledButton>
              <StyledButton variant="outlined" color="primary">
                <Link to={`/profileEdit/${userId}`} style={{textDecoration: "none", color: "inherit"}}>
                  Edit Profile
                </Link>
              </StyledButton>
            </ButtonContainer>
        )}
      </AvatarContainer>
      <TabsContainer>
        <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
          <TabList>
            <Tab>Created</Tab>
            <Tab>Saved</Tab>
            {isSeller && <Tab>Seller</Tab>}
          </TabList>
          <TabPanel>
            {isAuthenticated ? (

            <UserPins posts={createdPosts} />
            ) : (
              <div>
                <BlurredLoginPrompt message={"created posts"}/>
              </div>
            )}
          </TabPanel>
          <TabPanel>
            {isAuthenticated ? (
              <UserPins posts={savedPosts} />
            ) : (
              <div>
                <BlurredLoginPrompt message={"saved posts"}/>
              </div>
            )}
          </TabPanel>
          {isSeller && (
            <TabPanel>
              {isAuthenticated ? (
                <SellerItems />
              ) : (
                <div>You need to be logged in to see your seller items.</div>
              )}
            </TabPanel>
          )}
        </Tabs>
      </TabsContainer>
    </ProfileContainer >
  );
}

// Styled Components

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  
  gap: 10px;
  margin-bottom: 20px;

  .MuiButton-outlinedPrimary {
    border-color: #e60023;
    color: #e60023;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 150px !important; 
  height: 150px !important;
  margin-top: 20px;
  border: 2px solid white; 
`;

const UserName = styled.h2`
  font-weight: bold;
  font-size: 24px; 
  margin-top: 20px;
  margin-bottom: 10px;
  color: black; 
`;

const Email = styled.h3`
  font-weight: bold;
  font-size: 24px; 
  margin-top: 5px;
  margin-bottom: 10px;
  color: black; 
`;

const FollowInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 16px; 
  color: grey; 
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  && {
    margin: 5px;
    border-radius: 24px;
    border: 1px solid #efefef; 
    color: black; 
    font-weight: bold;
    background-color: #efefef; 
  }
`;

const TabsContainer = styled.div`
  width: 100%;
  
  .react-tabs__tab-list {
    border-bottom: 1px solid #e60023;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  .react-tabs__tab {
    list-style: none;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    color: #555;

    &--selected {
      border: none;
      border-bottom: 2px solid #e60023;
      color: #e60023;
    }
  }

  .react-tabs__tab-panel {
    display: none;
    &--selected {
      display: block;
    }
  }
`;



export default UserProfile;
