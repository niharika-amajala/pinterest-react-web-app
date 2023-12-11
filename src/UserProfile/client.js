import axios from 'axios';

export const PINTEREST_API_URL = 'https://pinterest-enhanced-node-server.onrender.com';
export const USERS_API = `${PINTEREST_API_URL}/users`;

export const profile = async (userId) => {
    try {
        const response = await axios.get(`${USERS_API}/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
};

export const postsCreatedByUser = async (userId) => {
    try {
        const response = await axios.get(`${USERS_API}/image/createdByUser/${userId}`);
        return response.data ? response.data.posts : response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
};

export const postsSavedByUser = async (userId) => {
    try {
        const response = await axios.get(`${USERS_API}/image/savedByUser/${userId}`);
        return response.data ? response.data.posts : response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
};

export const updateProfile = async (userId, updateUserData) => {
    try {
        const response = await axios.put(`${USERS_API}/profile/${userId}`, updateUserData);
        return response.data ? response.data.posts : response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const updatePassword = async (userId, updatePassword) => {
    try {
        const response = await axios.put(`${USERS_API}/password/${userId}`, updatePassword);
        return response.data ? response.data.posts : response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}