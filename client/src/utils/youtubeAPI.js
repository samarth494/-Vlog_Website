import axios from 'axios';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const fetchVideos = async (query = 'vlog', pageToken = '') => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        maxResults: 12,
        type: 'video',
        key: API_KEY,
        pageToken,
        regionCode: 'IN',
        relevanceLanguage: 'en',
      },
    });

    return {
      items: response.data.items,
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { items: [], nextPageToken: null };
  }
};
