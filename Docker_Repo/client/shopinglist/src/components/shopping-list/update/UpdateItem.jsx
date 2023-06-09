import './UpdateItem.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../auth/UserContext';
import { CartContext } from '../../auth/CartContext';
import axios from 'axios';

function UpdateItem() {
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [alias, setAlias] = useState(currentItem.alias || '');
  const [type, setType] = useState(currentItem.type || '');
  const active = true;
  const location = { "lat": 0, "lng": 0 }
  const [objectDetails, setObjectDetails] = useState({
    price: currentItem.objectDetails?.price || '',
    from: currentItem.objectDetails?.from || ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const cartObjectId = cart.objectId;
    const superapp = cartObjectId.superapp;
    const internalObjectId = cartObjectId.internalObjectId;
    const userSuperapp = user.userId.superapp;
    const userEmail = user.userId.email;
    const getCartItem = () => {
      axios.get(`http://localhost:8083/superapp/objects/${superapp}/${internalObjectId}/children?userSuperapp=${userSuperapp}&userEmail=${userEmail}`)
        .then(response => {
          const data = response.data;
          if (response.status === 200) {
            setItems(data.filter(item => item.active === true));
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
    getCartItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newBody = {
    type,
    alias,
    active,
    location,
    objectDetails,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = JSON.stringify(newBody);
    axios.put(`http://localhost:8083/superapp/objects/${currentItem.objectId.superapp}/${currentItem.objectId.internalObjectId}?userSuperapp=${user.userId.superapp}&userEmail=${user.userId.email}`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      if (response.status === 200) {
        console.log('Item added successfully');
        navigate(`/home/profile/shopping-list/cart`);
      }
    })
      .catch((error) => {
        console.log(error.response);
      });
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
    <div className="container-update">
      <h1>Update Item</h1>
      <form onSubmit={handleSubmit} value={currentItem}>
      <select id="selected_item" onChange={selectItem} value={currentItem.alias || ''}>
        <option value="" disabled={!currentItem.type}>
          CHOOSE ITEM TO UPDATE
        </option>
        {items.map((item) => (
          <option key={`${item.alias}-${item.type}`} value={item.alias}>
            Alias: {item.alias} || Email: {item.type}
          </option>
        ))}
      </select>
        <div className="form-group">
          <label htmlFor="alias">Name:</label>
          <input type="text" id="alias" name="alias" className="form-input" required
            value={alias} onChange={(event) => setAlias(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <input type="type" id="type" name="type" className="form-input" required
            value={type} onChange={(event) => setType(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input type="text" id="price" name="price" className="form-input" value={objectDetails.price}
            onChange={(event) => {
              const { value } = event.target;
              setObjectDetails((prevState) => ({ ...prevState, price: value }));
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="from">From:</label>
          <input type="text" id="from" name="from" className="form-input" value={objectDetails.from}
            onChange={(event) => {
              const { value } = event.target;
              setObjectDetails((prevState) => ({ ...prevState, from: value }));
            }}
          />
        </div>
        <button type="submit" className="btn-update"><Link to={`/home/profile/shopping-list`}>Go Back</Link></button>
        <button type="submit" className="btn-update">Submit</button>
      </form>

    </div>
  );
}

export default UpdateItem;
