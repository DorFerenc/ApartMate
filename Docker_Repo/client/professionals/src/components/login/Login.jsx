import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { UserContext } from '../auth/UserContext';
import axios from 'axios'

/**
 * Component for user login.
 * @returns {JSX.Element} Login component.
 */
function Login() {
  const { updateUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const superapp = '2023b.dor.ferenc';
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { toggleLogin } = useContext(AuthContext);

  /**
   * Handles the form submission for user login.
   * @param {React.SyntheticEvent} event - Form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: userData } = await axios.get(`http://localhost:8083/superapp/users/login/${superapp}/${email}`, {
        superapp,
        email
      }, {headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});

      toggleLogin(true);
      updateUser(userData);
      navigate('/home/profile/prof/search');
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="container-login">
      <h1 className='title-h1'>Login</h1>
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
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
