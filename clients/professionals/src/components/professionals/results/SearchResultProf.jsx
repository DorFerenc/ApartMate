import React, { useContext, useState } from 'react';
import './SearchResultProf.css';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../auth/UserContext';
import calculateDistance from './DistanceCalc';
import { ClientHouseContext } from '../../auth/ClientHouseContext';

function SearchResultProf() {
  const { location } = useContext(UserContext);
  const { clientHouse } = useContext(ClientHouseContext);

  const locationData = useLocation();
  const searchParams = new URLSearchParams(locationData.search);
  const lastParam = searchParams.get('last') === 'true' ? true : false;

  const items = lastParam ? (clientHouse?.objectDetails?.lastSearch?.data) : (locationData?.state?.data?.data)

  // console.log(items)
  const [sortedItems, setSortedItems] = useState(items); // State to store sorted items

  const sortBy = (type) => {
    let sortedArray;
    switch (type) {
      case 'distance':
        sortedArray = [...items].sort((a, b) => {
          const distanceA = calculateDistance(location.lat, location.lng, a.latitude, a.longitude);
          const distanceB = calculateDistance(location.lat, location.lng, b.latitude, b.longitude);
          return distanceA - distanceB;
        });
        break;
      case 'rating':
        sortedArray = [...items].sort((a, b) => b.rating - a.rating);
        break;
      default:
        sortedArray = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    setSortedItems(sortedArray);
  };
  


  return (
    <div className="Items">
      <main>
        {lastParam ? <h1>Last Results</h1> : <h1>Search Results</h1>}
        <button onClick={() => sortBy('distance')}>Sort by distance</button>
        <button onClick={() => sortBy('rating')}>Sort by rating</button>
        <button onClick={() => sortBy('default')}>Reset</button>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone number</th>
                <th>Location</th>
                <th>Type</th>
                <th>Working hours</th>
                <th>Time zone</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems !== undefined ? (
                sortedItems.map((item) => (
                  <tr key={item.business_id}>
                    <td>{item.name}</td>
                    <td>{item.phone_number}</td>
                    <td>
                      {calculateDistance(
                        location.lat,
                        location.lng,
                        item.latitude,
                        item.longitude
                      )} kilometers
                    </td>
                    <td>{item.type}</td>
                    <td>
                      {item.working_hours ? (
                        Object.entries(item.working_hours).map(([day, hours]) => (
                          <span key={day}>
                            {day}:<br />
                            {hours}
                            <br /><br />
                          </span>
                        ))
                      ) : (
                        <span>No working hours available</span>
                      )}
                    </td>
                    <td>{item.timezone}</td>
                    <td>{item.rating}★</td>
                  </tr>
                ))
              ) : (
                <p>No data...</p>
              )}
            </tbody>
          </table>
        </div>
        <Link to={`/home/profile/prof/search`} className="button-prof">
          Go Back
        </Link>
      </main>
    </div>
  );
}

export default SearchResultProf;
