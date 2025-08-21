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
 * @returns {Promise<Object>} - The response data from ImgChest API
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
      // Create a simplified response object with just what we need
      return {
        imageUrl: response.data.data.images[0].link,
        deleteUrl: response.data.data.delete_url
      };
    } else {
      throw new Error('Failed to upload image to ImgChest');
    }
  } catch (error) {
    console.error('Error uploading to ImgChest:', error);
    throw error;
  }
};

/**
 * Store the latest image URL and delete URL in localStorage
 * @param {string} url - The URL of the image
 * @param {string} deleteUrl - The URL to delete the image
 */
export const storeLatestImageUrl = (url, deleteUrl) => {
  localStorage.setItem('latestImageUrl', url);
  localStorage.setItem('deleteImageUrl', deleteUrl || '');
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

/**
 * Get the delete URL for the current image
 * @returns {string|null} - The URL to delete the image or null if not found
 */
export const getDeleteImageUrl = () => {
  return localStorage.getItem('deleteImageUrl');
};

/**
 * Delete an image using the delete URL in the background
 * @param {string} deleteUrl - The URL to delete the image
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const deleteImage = async (deleteUrl) => {
  try {
    if (!deleteUrl) return false;
    
    // Extract the post ID from the delete URL
    const postId = deleteUrl.split('/').filter(Boolean).pop();
    
    if (!postId) return false;
    
    // Make a silent background request to the delete URL
    const img = new Image();
    img.style.display = 'none';
    img.src = `${deleteUrl}?silent=true&t=${new Date().getTime()}`;
    document.body.appendChild(img);
    
    // Remove the image element after a short delay
    setTimeout(() => {
      if (document.body.contains(img)) {
        document.body.removeChild(img);
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
