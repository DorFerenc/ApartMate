import './SignUpPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { UserContext } from '../auth/UserContext';
import { CartContext } from '../auth/CartContext';
import axios from 'axios';

function SignUpPage() {
  const { updateUser } = useContext(UserContext);
  const { toggleLogin } = useContext(AuthContext);
  const { updateCart } = useContext(CartContext);

  const [email, setEmail] = useState('');
  const role = 'SUPERAPP_USER';
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [wrongDetails, setWrongDetails] = useState('');
  const navigate = useNavigate();
  const [objectDetails] = useState({});
  const type = 'cart'
  const active = true
  const creationTimestamp = '';
  const location = { "lat": 0, "lng": 0 };
  
  const createCart = (userData) => {
    console.log('userData', userData)
    const alias = type + '-' + userData?.userId.email
    const userId = { "superapp": userData?.userId.superapp, "email": userData?.userId.email }
    const createdBy = { "userId": userId };
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
    axios.post(`http://localhost:8083/superapp/objects`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      const data = response.data;
      if (response.status === 200) {
        console.log('Item added successfully');
        updateCart(data);
        navigate(`/home/profile/shopping-list`);
      }
    }).catch(error => {
      console.error(error);
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const signupUser = () => {
      const body = JSON.stringify({ email, role, username, avatar });
      axios.post('http://localhost:8083/superapp/users', body, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
      .then((response) => {
        const userData = response.data;
        if (response.status === 200) {
          updateUser(userData);
          toggleLogin(true);
          console.log('User created successfully')
          createCart(userData);
        }
      })
      .catch((error) => {
        setWrongDetails(error.message);
        console.log(error);
      });
    }
    signupUser();
  };


  return (
    <div className="container-signup">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" className="form-input" required
            value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input maxLength="16" type="username" id="username" name="username" className="form-input" required
            value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar:</label>
          <input ype="avatar" id="avatar" name="avatar" className="form-input"
            value={avatar} onChange={(event) => setAvatar(event.target.value)} />
        </div>
        <p>{wrongDetails}</p>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}

export default SignUpPage;
