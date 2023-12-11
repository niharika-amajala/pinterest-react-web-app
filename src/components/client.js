import axios from 'axios';

export const PINTEREST_API_URL = 'https://pinterest-enhanced-node-server.onrender.com';

export const IMAGES_API = `${PINTEREST_API_URL}/images`;
export const USERS_API = `${PINTEREST_API_URL}/users`;
export const ADMIN_API = `${PINTEREST_API_URL}/admin`;

export const getCategoryImages = async (term) => {
    try {
        const response = await axios.get(`${IMAGES_API}/getCategoryImages`, {
            params: {
                term
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const imageUploadUnsplash = async (image) => {
    try {
        const response = await axios.post(`${IMAGES_API}/imageUploadUnsplash`, image);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const getAllPosts = async () => {
    try {
        const response = await axios.get(`${USERS_API}/get-posts`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${ADMIN_API}/getAllUsers`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const getAllPostsAdmin = async () => {
    try {
        const response = await axios.get(`${ADMIN_API}/getAllPosts`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${ADMIN_API}/deleteUser`, {
            params: {
                userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}

export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${ADMIN_API}/deletePost`, {
            params: {
                postId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response);
        throw error.response.data;
    }
}