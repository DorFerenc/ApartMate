import React, { useState } from 'react';
import './Home.css';

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [cards, setCards] = useState([
    {
      title: 'LOGIN',
      description: (
        <div><ul>
          <li className='header-li-text'>Already have account?</li>
          <li><a href="/login">Login</a></li>
        </ul></div>
      )
    },
    {
      title: 'SHOPPING LIST',
      description: 
      "Add a new item to the shopping list."
      + "You will be prompted to enter the item details."
      + "You can also to convert to cart's list to PDF file."
    }
  ]);

  return (
    <div className="Container">
      <div className="CardsContainer">
        <div className="Cards">
          {cards.map((card, index) => (
            <div key={index} className="Card">
              <h2 className="CardTitle">{card.title}</h2>
              <h5 className="CardDescription">{card.description}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
