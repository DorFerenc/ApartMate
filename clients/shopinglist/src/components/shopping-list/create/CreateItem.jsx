import './CreateItem.css';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../auth/UserContext';
import { CartContext } from '../../auth/CartContext';
import axios from 'axios';

function CreateItem() {
  const { cart } = useContext(CartContext);
  const { user, updateUser } = useContext(UserContext);
  const [type, setType] = useState('');
  const [alias, setAlias] = useState('');
  const active = true;
  const creationTimestamp = '';
  const location = { "lat": 0, "lng": 0 }
  const userId = { "superapp": user?.userId.superapp, "email": user?.userId.email }
  const createdBy = { "userId": userId }
  const [objectDetails, setDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const updateRoleUser = (role) => {
      let newUser = user;
      newUser.role = role;
      updateUser(newUser);
      const body = JSON.stringify(user)
      axios.put(`http://localhost:8083/superapp/users/${user.userId.superapp}/${user.userId.email}`, body, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => {
          if (response.status === 200) {
            console.log('User updated successfully');
          }
        }).catch((error) => {
          console.log(error);
        });
    }
    if (user.role === 'MINIAPP_USER') {
      updateRoleUser('SUPERAPP_USER');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBody = {
      type,
      alias,
      active,
      creationTimestamp,
      location,
      createdBy,
      objectDetails,
    };
    const body = JSON.stringify(newBody);
    const createItem = () => {
      axios.post(`http://localhost:8083/superapp/objects`, body, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          const data = response.data;
          if (response.status === 200) {
            const dataObj = data.objectId;
            bindChildObject(dataObj);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
    const bindChildObject = (dataObj) => {
      const body = JSON.stringify(dataObj);
      axios.put(`http://localhost:8083/superapp/objects/${cart.objectId.superapp}/` +
        `${cart.objectId.internalObjectId}/children?userSuperapp=${user.userId.superapp}` +
        `&userEmail=${user.userId.email}`, body, {
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        if (response.status === 200) {
          console.log('Item bind successfully');
          navigate(`/home/profile/shopping-list/cart`);
        }
      })
        .catch((error) => {
          console.error(error);
        });
    }
    createItem();
  };

  return (
    <div className="container-create">
      <h1>New Item</h1>
      <form onSubmit={handleSubmit}>
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
          <input type="price" id="price" name="price" className="form-input"
            onChange={(event) => {
              const { name, value } = event.target;
              setDetails((prevState) => ({ ...prevState, [name]: value }));
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="from">From:</label>
          <input type="from" id="from" name="from" className="form-input"
            onChange={(event) => {
              const { name, value } = event.target;
              setDetails((prevState) => ({ ...prevState, [name]: value }));
            }}
          />
        </div>
        <button type="submit" className="btn-create"><Link to={`/home/profile/shopping-list`}>Go Back</Link></button>
        <button type="submit" className="btn-create">Submit</button>
      </form>
    </div>
  );
}

export default CreateItem;
