import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../auth/UserContext';
import { CartContext } from '../../auth/CartContext';
import './Cart.css';
import axios from 'axios';

function Cart() {
  const options = ['alias', 'type', 'price', 'from'];
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [items, setItems] = useState([]);
  const { user } = useContext(UserContext);
  const { updateCart } = useContext(CartContext);
  const type = 'cart';
  const [selectedOption, setSelectedOption] = useState('alias');

  useEffect(() => {
    const setItemsCart = (data, type, user, updateCart, setItems) => {
      const cart = data.find((cart) => cart.alias === type + '-' + user.userId.email
      );
      if (cart) {
        updateCart(cart);
        const cartObjectId = cart.objectId;

        const superapp = cartObjectId.superapp;
        const internalObjectId = cartObjectId.internalObjectId;
        const userSuperapp = user.userId.superapp;
        const userEmail = user.userId.email;

        axios.get(`http://localhost:8083/superapp/objects/${superapp}/${internalObjectId}/children?userSuperapp=${userSuperapp}&userEmail=${userEmail}`)
          .then((response) => {
            const data = response.data;
            if (response.status === 200) {
              setItems(data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    const getCartByTypeOrCreate = () => {
      axios
        .get(
          `http://localhost:8083/superapp/objects/search/byType/${type}?userSuperapp=${user.userId.superapp}&userEmail=${user.userId.email}`
        )
        .then((response) => {
          console.log(response);
          const data = response.data;
          if (response.status === 200 && data.length > 0) {
            setItemsCart(data, type, user, updateCart, setItems);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getCartByTypeOrCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredItems(items);
    }
    else {
      setFilteredItems(items.filter((item) => {
        // from or price
        if (selectedOption !== 'alias' && selectedOption !== 'type' && selectedOption !== undefined) {
          return String(item.objectDetails[selectedOption]).toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        //alias or type
        else {
          return item[selectedOption].toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
      })
      );
    }
  }, [searchQuery, items, selectedOption]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setSearchQuery('');
  };

  return (
    <div className="Items">
      <main>
        <h1>Cart</h1>
        <div className="Search">
          <div className="radio-search">
            {options.map((option) => (
              <div key={option}>
                <label htmlFor={option}>{option}</label>
                <input type="radio" id={option} value={option} checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                />
                <input className="search-bar" type="text" placeholder="Search..."
                  value={selectedOption === option ? searchQuery : ''} onChange={handleSearchChange}
                  disabled={selectedOption !== option}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Active</th>
                <th>Type</th>
                <th>Alias</th>
                <th>Creation time</th>
                <th>Created by</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.objectId.internalObjectId} className={item.active ? 'active' : 'inactive'}>
                  <td>{item.active === true ? <h2>YES</h2> : <h2>NO</h2>}</td>
                  <td>{item.type}</td>
                  <td>{item.alias}</td>
                  <td>{item.creationTimestamp}</td>
                  <td>{item.createdBy.userId.email}</td>
                  <td>{Object.entries(item.objectDetails).length > 0 ? (
                    Object.entries(item.objectDetails).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key} - </strong> {JSON.stringify(value)}
                      </div>
                    ))
                  ) : (
                    <strong> Null </strong>
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to={`/home/profile/shopping-list`} className="button-cart">
          Go Back
        </Link>
      </main>
    </div>
  );
}

export default Cart;
