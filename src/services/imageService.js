import axios from 'axios';

// ImgChest API token - you'll need to register at https://imgchest.com/
// Create your token at https://imgchest.com/docs/api/1.0/general/authorization
const IMGCHEST_TOKEN = 'MxtsdGof6tBnQHf6JwOfHdv2xSUwtMl2OJpTqGag6c947c37';

// Create an axios instance with ImgChest API configuration
const imgChestApi = axios.create({
  baseURL: 'https://api.imgchest.com/v1',
  headers: {
    'Authorization': `Bearer ${IMGCHEST_TOKEN}`,
    'Accept': 'application/json'
  }
});

/**
 * Upload an image to ImgChest
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('images[]', imageFile);
    formData.append('privacy', 'hidden');
    formData.append('nsfw', 'false');
    
    const response = await imgChestApi.post('/post/', formData);
    
    console.log('ImgChest response:', response.data);
    
    if (response.data && response.data.data && response.data.data.images && response.data.data.images.length > 0) {
      // Return the direct link to the image
      return response.data.data.images[0].link;
    } else {
      throw new Error('Failed to upload image to ImgChest');
    }
  } catch (error) {
    console.error('Error uploading to ImgChest:', error);
    throw error;
  }
};

/**
 * Store the latest image URL in localStorage
 * @param {string} url - The URL of the image
 */
export const storeLatestImageUrl = (url) => {
  localStorage.setItem('latestImageUrl', url);
  localStorage.setItem('lastUpdated', new Date().toISOString());
};

/**
 * Get the latest image URL from localStorage
 * @returns {string|null} - The URL of the latest image or null if not found
 */
export const getLatestImageUrl = () => {
  return localStorage.getItem('latestImageUrl');
};

/**
 * Get the last updated timestamp
 * @returns {Date|null} - The timestamp when the image was last updated
 */
export const getLastUpdatedTimestamp = () => {
  const timestamp = localStorage.getItem('lastUpdated');
  return timestamp ? new Date(timestamp) : null;
};
