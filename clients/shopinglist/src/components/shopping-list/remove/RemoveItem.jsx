import './RemoveItem.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../auth/UserContext';
import { CartContext } from '../../auth/CartContext';
import axios from 'axios';

function RemoveItem() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user, updateUser } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [alias, setAlias] = useState(currentItem.alias || '');
  const [type, setType] = useState(currentItem.type || '');
  const [objectDetails, setObjectDetails] = useState({
    price: currentItem.objectDetails?.price || '',
    from: currentItem.objectDetails?.from || ''
  });

  const command = 'removeProducts';
  const objectId = currentItem.objectId;
  const targetObject = { objectId };
  const invocationTimestamp = '2023-03-11T10:17:54.933+00:00';
  const userId = user.userId
  const invokedBy = { userId };
  const commandAttributes = { "operation": "remove item" }
  const miniAppName = 'Cart';
  const asyncFlag = false;

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
      }).catch((error) => {
        console.log(error.response);
      });
    }
    if (user.role === 'SUPERAPP_USER') {
      updateRoleUser('MINIAPP_USER');
    }
    const getCartItems = () => {
      const cartObjectId = cart.objectId;
      axios.get(`http://localhost:8083/superapp/objects/${cartObjectId.superapp}/${cartObjectId.internalObjectId}/children?userSuperapp=${user.userId.superapp}&userEmail=${user.userId.email}`)
        .then(response => {
          const data = response.data;
          if (response.status === 200) {
            setItems(data.filter(item => item.active === true));
          }
        }).catch((error) => {
          console.log(error.response);
        });
    }
    getCartItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // CHECK WHAT IS GOING ON
    const deleteItemCommand = () => {
      const newBody = {
        command,
        targetObject,
        invocationTimestamp,
        invokedBy,
        commandAttributes,
      };
      const body = JSON.stringify(newBody);
      axios.post(`http://localhost:8083/superapp/miniapp/${miniAppName}?async=${asyncFlag}`, body, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        if (response.status === 200) {
          console.log('Item removed successfully');
          navigate(`/home/profile/shopping-list`);
        }
      }).catch((error) => {
        console.log(error.response);
      });
    }
    deleteItemCommand();
  };

  const selectItem = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption !== '') {
      const item = items.find((item) => item.alias === selectedOption);
      setCurrentItem(item || {});
      setAlias(item.alias);
      setType(item.type);
      setObjectDetails({
        price: item.objectDetails?.price || '',
        from: item.objectDetails?.from || ''
      });
    }
  };

  return (
    <div className="container-remove">
      <h1>Remove Item</h1>
      <form onSubmit={handleSubmit} value={currentItem}>
        <select id="selected_item" onChange={selectItem} value={currentItem.alias || ''}>
          <option value="" disabled={!currentItem.type}>
            CHOOSE ITEM TO REMOVE
          </option>
          {items.map((item) => (
            <option key={`${item.alias}-${item.type}`} value={item.alias}>
              Alias: {item.alias} || Email: {item.type}
            </option>
          ))}
        </select>
        <div className="form-group">
          <label htmlFor="alias">Name: {alias}</label>
        </div>
        <div className="form-group">
          <label htmlFor="type">Type: {type}</label>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price: {objectDetails.price}</label>
        </div>
        <div className="form-group">
          <label htmlFor="from">From: {objectDetails.from}</label>
        </div>
        <button type="submit" className="btn-update"><Link to={`/home/profile/shopping-list`}>Go Back</Link></button>
        <button type="submit" className="btn-update">Remove</button>
      </form>

    </div>
  );
}

export default RemoveItem;