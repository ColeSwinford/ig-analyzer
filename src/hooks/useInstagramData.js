import { useState } from 'react';
import { extractUsernames } from '../utils/analysis';

export const useInstagramData = () => {
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  const [fileNameFollowers, setFileNameFollowers] = useState(null);
  const [fileNameFollowing, setFileNameFollowing] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const userList = extractUsernames(json);
        
        if (userList.length === 0) {
           setError(`Parsed 0 users from ${type}. Check if you uploaded the correct JSON file.`);
           return; 
        }

        if (type === 'followers') {
          setFollowersData(userList);
          setFileNameFollowers(file.name);
        } else {
          setFollowingData(userList);
          setFileNameFollowing(file.name);
        }
        setError('');
      } catch (err) {
        setError(`Error parsing ${type} file.`);
      }
    };
    reader.readAsText(file);
  };

  const processData = () => {
    if (!followersData || !followingData) return null;

    const followerSet = new Set(followersData.map(u => u.username));
    const followingSet = new Set(followingData.map(u => u.username));

    return {
      notFollowingBack: followingData.filter(user => !followerSet.has(user.username)),
      fans: followersData.filter(user => !followingSet.has(user.username)),
      mutuals: followingData.filter(user => followerSet.has(user.username)),
    };
  };

  return {
    followersData,
    followingData,
    fileNameFollowers,
    fileNameFollowing,
    error,
    handleFileUpload,
    processData
  };
};