import React, { createContext, useEffect, useState } from 'react';
import { useCallback } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a UserProvider component
const UserProvider = ({ children }) => { 
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  );
  const [location, setLocation] = useState({ lat: 0.0, lng: 0.0 });

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({"lat": latitude, "lng": longitude });
          return location;
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  },[location]);
  
  useEffect(() => {
    getLocation();
  }, [getLocation]);
  
  useEffect(() => {
    console.log('user', user);
    console.log('location', location);
  },[location, user])


  // Function to update the user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateLocation = (locationData) => {
    setLocation(locationData);
  };

  // Value object to be passed as the value prop of UserContext.Provider
  const value = {
    user,
    updateUser,
    location,
    updateLocation
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };