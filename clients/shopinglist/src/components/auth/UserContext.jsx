import React, { createContext, useEffect, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a UserProvider component
const UserProvider = ({ children }) => { 
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  );
  
  useEffect(() => {
    console.log('user', user);
  },[user])


  // Function to update the user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Value object to be passed as the value prop of UserContext.Provider
  const value = {
    user,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };