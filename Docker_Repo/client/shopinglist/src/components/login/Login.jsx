import './Login.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { UserContext } from '../auth/UserContext';
import axios from 'axios';

function Login() {
  const { updateUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const superapp = '2023b.dor.ferenc';
  const [wrongDetails, setWrongDetails] = useState('');
  const navigate = useNavigate();
  const { toggleLogin } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.get(`http://localhost:8083/superapp/users/login/${superapp}/${email}`)
    .then((response) => {
      const data = response.data;
      if (response.status === 200) {
        toggleLogin(true);
        updateUser(data)
        navigate(`/home/profile/shopping-list`);
      }
    }).catch((error) => {
        setWrongDetails(error.message);
        console.log(error.response);
      });
  };

  return (
    <div className="container-login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" className="form-input" required
            value={email} onChange={(event) => setEmail(event.target.value)} />
          <p>{wrongDetails}</p>
        </div>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}

export default Login;
