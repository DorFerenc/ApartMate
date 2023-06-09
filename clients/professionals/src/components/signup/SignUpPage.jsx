import './SignUpPage.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { UserContext } from '../auth/UserContext';
import { ClientHouseContext } from '../auth/ClientHouseContext';

/**
 * Component for the sign-up page.
 */
function SignUpPage() {
  const { updateUser, location } = useContext(UserContext);
  const { toggleLogin } = useContext(AuthContext);
  const { updateClientHouse } = useContext(ClientHouseContext);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [wrongDetails, setWrongDetails] = useState('');
  const navigate = useNavigate();

  /**
   * Handles the form submission.
   * @param {Event} event - The form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: userData } = await axios.post('http://localhost:8083/superapp/users', {
        email,
        role: 'SUPERAPP_USER',
        username,
        avatar
      }, {headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});

      toggleLogin(true);
      updateUser(userData);
      await createClientHouse(userData);
    } catch (error) {
      if(error.response.status === 409) {
        setWrongDetails('User already exists.');
      } 
      console.error(error);
    }
  };

  /**
   * Creates a client house object.
   * @param {Object} user - The user object.
   */
  const createClientHouse = async (user) => {
    const type = 'house';
    const alias = `${type}-${user?.userId.email}`;
    const userId = { superapp: user?.userId.superapp, email: user?.userId.email };
    const createdBy = { userId };
    const newBody = {
      type,
      alias,
      active: true,
      creationTimestamp: '',
      location,
      createdBy,
      objectDetails: { 'client-house': 'house' }
    };

    try {
      const { data } = await axios.post('http://localhost:8083/superapp/objects', newBody, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });

      console.log('House added successfully');
      updateClientHouse(data);
      navigate('/home/profile/prof/search');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-signup">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            maxLength="16"
            type="username"
            id="username"
            name="username"
            className="form-input"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="avatar"
            id="avatar"
            name="avatar"
            className="form-input"
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
          />
        </div>
        <p>{wrongDetails}</p>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}

export default SignUpPage;
