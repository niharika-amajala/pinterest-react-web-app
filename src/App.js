// App.js
import React, { useLocation, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import NavBar from './HomeNavigation/NavBar';
import Login from './Login/login';
import UserProfile from './UserProfile/userprofile';
import Registration from './Registration/registration';
import Header from './components/Header';
import Mainboard from './components/Mainboard';
import CategorySelection from './preferences/CategorySelection';
import ExplorePage from './explore/ExplorePage';
import UserEditProfile from './UserProfile/userEditProfile';
import UserEditPassword from './UserProfile/userEditPassword';
import AddPinPage from './AddPin/AddPinPage';
import PinDetail from './details/Details';
import AdminDashboard from './components/AdminDashboard';

import * as client from './components/client';
import { createToken } from './authReducer';

import './App.css';

function App() {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);

  // Check if the user is authenticated and has a token in local storage
  if (localStorage.getItem('authToken')) {
    isAuthenticated = true;
    dispatch(createToken(localStorage.getItem('authToken')));
  }

  const [pins, setNewPins] = useState([]);
  const [redirectToPreferences, setRedirectToPreferences] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { category } = useParams();

  const onSearchSubmit = (term) => {
    client.getCategoryImages(term).then((res) => {
      let newPins = [...res, ...pins];
      //newPins.sort(() => 0.5 - Math.random());
      setNewPins(newPins);
    });
  };

  useEffect(() => {
    const getNewPins = async () => {
      let promises = [];
      let pinData = [];

      try {
        const response = await client.getAllPosts();
        let posts = response.data;
        for (let index = 0; index < posts.length; index++) {
          let post = posts[index];
          posts[index] = {
            ...post,
            regular: post.docId,
          };
        }

        pinData = posts;

        const allCategories = [...selectedCategories, 'coding', 'makeup', 'street', category].filter(Boolean);

        allCategories.forEach((pinTerm) => {
          promises.push(
            client.getCategoryImages(pinTerm).then((res) => {
              res.forEach((result, index) => { });
              pinData = pinData.concat(res);
              pinData.sort(function (a, b) {
                return 0.5 - Math.random();
              });
            })
          );
        });

        Promise.all(promises).then(() => {
          setNewPins(pinData);
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getNewPins();
  }, [selectedCategories, category]);

  const handleExploreCategoriesSelected = (category) => {
    console.log('Selected category from ExplorePage:', category);
    setSelectedCategories(category);
    const categoriesSet = ['cars', 'pets', 'flowers', 'nature', 'gift', 'pink', 'red', 'rainbow', 'frog', 'coding', 'makeup', 'street'];
    const shuffledCategories = categoriesSet.sort(() => 0.5 - Math.random());
    let randomPinSelection = shuffledCategories.slice(0, 7);
    let shuffledPins = [...category, ...randomPinSelection];
    setNewPins(shuffledPins);
  };

  const handleCategoriesSelected = (categories) => {
    console.log('Selected categories:', categories);
    setSelectedCategories(categories);
    try {
      let promises = [];
      let pinData = [];
      const allCategories = [...categories, 'coding', 'makeup', 'street'];
      allCategories.forEach((pinTerm) => {
        promises.push(
          client.getCategoryImages(pinTerm).then((res) => {
            res.forEach((result, index) => { });
            pinData = pinData.concat(res);
            pinData.sort(function (a, b) {
              return 0.5 - Math.random();
            });
          })
        );
      });

      Promise.all(promises).then(() => {
        setNewPins(pinData);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  function MainboardWrapper() {
    const { category } = useParams();
    const [categoryPins, setCategoryPins] = useState([]);

    useEffect(() => {
      if (category) {
        client.getCategoryImages(category).then((res) => {
          setCategoryPins(res);
        });
      } else {
        const categoriesSet = ['cars', 'pets', 'flowers', 'nature', 'gift', 'pink', 'red', 'rainbow', 'frog', 'coding', 'makeup', 'street'];
        const shuffledCategories = categoriesSet.sort(() => 0.5 - Math.random());
        let randomPinSelection = shuffledCategories.slice(0, 5);
        Promise.all(randomPinSelection.map(category => client.getCategoryImages(category)))
          .then(results => {
            const combinedPins = results.flat();
            const filteredPins = pins.filter(res => !res.regular.startsWith("https://storage.googleapis.com/"));
            let newPins = [ ...filteredPins, ...combinedPins];
            setCategoryPins(newPins);
          })
          .catch(error => {
            console.error('Error fetching category images:', error);
          });
      }
    }, [category]);

    return <Mainboard pins={categoryPins} />;
  }

  useEffect(() => {
    handleCategoriesSelected(selectedCategories);
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="app" style={{ minHeight: '100vh' }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                <MainboardWrapper />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                <MainboardWrapper />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <NavBar />
                <div className="overlay-text">Login to create pins</div>
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <NavBar />
                <div className="overlay-text">Sign up to get your ideas</div>
                <Registration />
              </>
            }
          />
          <Route
            path="/mainboard" element={
              isAuthenticated ? (
                <>
                  <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                  <Mainboard pins={pins} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/admin-dashboard" element={
            isAuthenticated ? (
              <>
                <AdminDashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
          />
          <Route
            path="/profile"
            element={

                <>
                  <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                  <UserProfile />
                </>

            } />
          <Route path="/profile/:profileUserId" element={
            // isAuthenticated ? (
              <>
                <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                <UserProfile />
              </>
            // ) : (
              // <Navigate to="/login" />
            // )
          }
          />
          <Route path="/passwordEdit/:userId"
            element={
              isAuthenticated ? (
                <>
                  <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                  <UserEditPassword />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profileEdit/:userId"
            element={
              isAuthenticated ? (
                <>
                  <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                  <UserEditProfile />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {redirectToPreferences && <Navigate to="/preferences" />}
          <Route path="/preferences" element={<CategorySelection onCategoriesSelected={setSelectedCategories} />} />
          <Route path="/explore" element={
            <>
              <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
              <ExplorePage onCategoriesSelected={handleExploreCategoriesSelected} />
            </>
          } />
          <Route
            path="/explore/:category"
            element={
              <>
                <Header onSearchSubmit={onSearchSubmit} isAuthenticated={isAuthenticated} />
                <MainboardWrapper />
              </>
            }
          />
          <Route path="/details" element={<PinDetail onSearchSubmit={onSearchSubmit} />} />
          <Route path="/add" element={<AddPinPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
