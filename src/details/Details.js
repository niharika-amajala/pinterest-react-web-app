// Details.js
import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {
  Wrapper,
  ImageContainer,
  ImageCard,
  ContentContainer,
  DummyText,
  UserContainer,
  UserImagePlaceholder,
  UserInfo,
  UserName,
  CommentList,
  CommentItem as StyledCommentItem, // Rename to avoid conflict with CommentItem variable
  AddCommentForm,
  ButtonContainer,
  Button,
  CommentUserImage, // Import CommentUserImage from detailsStyles.js
} from './detailsStyles.js';
import Header from '../components/Header'; // Import the Header component

import * as DetailClient from "./client";
import * as UserClient from "../UserProfile/client";

import styled from "styled-components";
import {useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {toast, ToastContainer} from "react-toastify";

function Details() {
  const authToken = useSelector((state) => state.authReducer.token);
  let isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search)

  const docId = params.get('docId');
  const postId = params.get('postId');
  const imageUrl = docId;
  const postUserId = params.get('postUserId');

  const [user, setUser] = useState({});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [imageData, setImageData] = useState({});

  const [currentUserId, setCurrentUserId] = useState(1);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(async () => {
    const details = await DetailClient.getImageDetails(docId, postUserId, postId);
    setImageData(details.imageUpload);
    setComments(details.comments);
    setUser(details.user);

    let {id} = await jwtDecode(authToken);
    const res = await UserClient.profile(id);

    setCurrentUserId(id);
    setCurrentUser(res);
  }, [docId, postUserId])

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Add logic to save the comment
    if (comment.trim() !== '') {
      // You can replace the user icon with the actual user profile image
      let commentBody = {
        content: comment,
        postId,
        userId: currentUserId
      }

      await DetailClient.saveComment(commentBody);
      setComments([...comments, { user: {firstName: currentUser.firstName}, content: comment }]);
      setComment('');
    }
  };

  const handleDownloadClick = () => {
    // Open the image URL in a new tab
    window.open(imageUrl, '_blank');
  };

  const handleSavePinClick = async () => {
    await DetailClient.savePost({
      postId: postId,
      userId: currentUserId
    }).then(() => {
      toast.success('Post saved!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch((err) => {
      toast.error(err.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  return (
    <>
      <Header onSearchSubmit={(term) => navigate(`/mainboard?q=${term}`)} isAuthenticated={isAuthenticated} /> {/* Header with search functionality */}
      <Wrapper>
        <ToastContainer />
        <ImageContainer>
          <ImageCard>
            <img src={imageUrl} alt="pin" />
          </ImageCard>
          <ButtonContainer>
            <Button onClick={handleSavePinClick}>Save Pin</Button>
            <Button onClick={handleDownloadClick}>Download Pin</Button>
          </ButtonContainer>
        </ImageContainer>
        <ContentContainer>
          <Title>
            {imageData.title}
          </Title>
          <PinDescription>
            {imageData.description}
          </PinDescription>
          <UserContainer>
            <UserInfo>
              {/* Display user information here */}
              <Link to={`/profile/${user.id}`}>
                <UserName>{user.firstName + ' ' + user.lastName}</UserName>
              </Link>
            </UserInfo>
          </UserContainer>
          <CommentList>
            {comments.map((c, index) => (
              <StyledCommentItem key={index}>
                <b>{c.user ? c.user.firstName : "Anonymous"}:&nbsp;</b>
                {c.content}<br />
              </StyledCommentItem>
            ))}
          </CommentList>
          <AddCommentForm onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={handleCommentChange}
            />
            <button type="submit">Add Comment</button>
          </AddCommentForm>
        </ContentContainer>
      </Wrapper>
    </>
  );
}

const Title = styled.h2`
  font-weight: bold;
  font-size: 24px; 
  margin-top: 20px;
  margin-bottom: 10px;
  color: black; 
`;

const PinDescription = styled.h2`
  font-weight: bold;
  font-size: 14px; 
  margin-top: 10px;
  margin-bottom: 10px;
  color: black; 
`;

export default Details;
