import React, { createContext, useEffect, useState } from 'react';

// Create the UserContext
const ClientHouseContext = createContext();

// Create a UserProvider component
const ClientHouseProvider = ({ children }) => {
  const [clientHouse, setClientHouse] = useState (
    localStorage.getItem('clientHouse') ? JSON.parse(localStorage.getItem('clientHouse')) : {}
  );

  useEffect(() => {
    console.log('clientHouse', clientHouse);
  },[clientHouse]);

  // Function to update the user data
  const updateClientHouse = (data) => {
    setClientHouse(data);
    localStorage.setItem('clientHouse', JSON.stringify(data));
  };

  // Value object to be passed as the value prop of UserContext.Provider
  const value = {
    clientHouse,
    updateClientHouse,
  };

  return (
    <ClientHouseContext.Provider value={value}>
      {children}
    </ClientHouseContext.Provider>
  );
};

export { ClientHouseContext, ClientHouseProvider };
