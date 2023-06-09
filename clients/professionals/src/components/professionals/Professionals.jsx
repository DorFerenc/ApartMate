import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Professionals.css';
import { UserContext } from '../auth/UserContext';
import { ClientHouseContext } from '../auth/ClientHouseContext';
import axios from 'axios';

/**
 * Component for searching professionals.
 * @returns {JSX.Element} Professionals component.
 */
function Professionals() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const { clientHouse, updateClientHouse } = useContext(ClientHouseContext);

  const type = 'house';
  const [prof, setProf] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const command = 'searchProfessional';
  const objectId = clientHouse?.objectId; // Use optional chaining to handle undefined values
  const targetObject = { objectId };
  const invocationTimestamp = '2023-03-11T10:17:54.933+00:00';
  const userId = user?.userId; // Use optional chaining to handle undefined values
  const invokedBy = { userId };
  const commandAttributes = { professionalName: prof, city, country };
  const miniAppName = 'Professionals';
  const asyncFlag = false;
  
  const handleLast = async (event) => {
    event.preventDefault();
    navigate('/home/profile/prof/search/result?last=true');
  };
  const updateLastResultSearch = async () => {
    const response = await axios.get(`http://localhost:8083/superapp/objects/search/byType/${type}?userSuperapp=${user?.userId?.superapp}&userEmail=${user?.userId?.email}`);
    if (response.status === 200) {
      const data = response.data;
      updateClientHouse(data);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBody = {
        command,
        targetObject,
        invocationTimestamp,
        invokedBy,
        commandAttributes,
      };
      const response = await axios.post(`http://localhost:8083/superapp/miniapp/${miniAppName}?async=${asyncFlag}`, newBody, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      if (response.status === 200) {
        console.log('Search successful');
        await updateLastResultSearch();
        navigate('/home/profile/prof/search/result?last=false', { state: { data: response.data } });
      }          
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateRoleUser = async (role) => {
      try {
        let newUser = { ...user }; // Create a copy of the user object
        newUser.role = role;
        updateUser(newUser);

        const response = await axios.put(`http://localhost:8083/superapp/users/${user?.userId?.superapp}/${user?.userId?.email}`, newUser, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 200) {
          console.log('User updated successfully');
        }
      } catch (error) {
        console.log(error);
      }
    };

    const setClientHouse = (data, type, user, updateClientHouse) => {
      const house = data.find((house) => house.alias === `${type}-${user?.userId?.email}`);
      updateClientHouse(house);
    };

    const getClientHouseOrCreate = async () => {
      try {
        if (user?.role !== 'MINIAPP_USER') {
          await updateRoleUser('MINIAPP_USER');
        }

        const response = await axios.get(`http://localhost:8083/superapp/objects/search/byType/${type}?userSuperapp=${user?.userId?.superapp}&userEmail=${user?.userId?.email}`);
        if (response.status === 200) {
          const data = response.data;
          setClientHouse(data, type, user, updateClientHouse);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getClientHouseOrCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Professionals">
      <main>
        <h1>Search Professionals</h1><br />
        <button onClick={handleLast}>Last Search</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="prof">Professional name:</label>
            <input type="text" id="prof" name="prof" className="form-input" required
              value={prof} onChange={(event) => setProf(event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="country">Country:</label>
            <input maxLength="16" type="text" id="country" name="country" className="form-input" required
              value={country} onChange={(event) => setCountry(event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="city">City:</label>
            <input maxLength="16" type="text" id="city" name="city" className="form-input" required
              value={city} onChange={(event) => setCity(event.target.value)} />
          </div>
          <button type="submit" className="btn">Submit</button>
        </form>
      </main>
    </div>
  );
}

export default Professionals;
