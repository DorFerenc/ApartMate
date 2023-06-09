import React, { useContext, useEffect } from 'react';
import './ShoppingList.css'
import { Link } from 'react-router-dom';
import { UserContext } from '../auth/UserContext';
import axios from 'axios';

function ShoppingList() {
  const { user, updateUser } = useContext(UserContext);
  const url = '/home/profile/shopping-list';
  
  useEffect(() => {
    const updateRoleUser = (role) => {
      let newUser = user;
      newUser.role = role;
      updateUser(newUser);
      const body = JSON.stringify(user);
      axios.put(`http://localhost:8083/superapp/users/${user.userId.superapp}/${user.userId.email}`, body, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        if (response.status === 200) {
          console.log('User updated successfully');
        }
      })
        .catch((error) => {
          console.error(error);
        });
    }
    if (user.role === 'MINIAPP_USER') {
      updateRoleUser('SUPERAPP_USER');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="ShoppingList">
      <main>
        <h1>Shopping List</h1>
        <nav>
          <ul>
            <Link to={`${url}/create`}>Add new item</Link>
            <Link to={`${url}/cart`}>View cart</Link>
            <Link to={`${url}/update`}>Update item</Link>
            <Link to={`${url}/disable`}>Remove item</Link>
          </ul>
        </nav>
      </main>
    </div>
  );
}

export default ShoppingList;
