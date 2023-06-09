import React, { createContext, useEffect, useState } from 'react';

// Create the CartContext
const CartContext = createContext();

// Create a CartProvider component
const CartProvider = ({ children }) => { 
  const [cart, setCart] = useState(
    localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {}
  );
  
  useEffect(() => {
    console.log('cart', cart);
  },[cart])


  // Function to update the cart data
  const updateCart = (data) => {
    setCart(data);
    localStorage.setItem('cart', JSON.stringify(data));
  };

  // Value object to be passed as the value prop of UserContext.Provider
  const value = {
    cart,
    updateCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };