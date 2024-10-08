import './App.css';
import SkeletonPlaceholder from './Skeleton';
import React from 'react';
import { useEffect, useState } from 'react';

// Fetch cat facts from https://cat-fact.herokuapp.com/facts
const fetchData = async () => {
  // Delay the fetch
  await new Promise(resolve => setTimeout(resolve, 2000));

  const response = await fetch('https://cat-fact.herokuapp.com/facts');
  const data = await response.json();
  return data;
};

function App() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(setFacts)
      .finally(() => setLoading(false));
  }, []);

  const renderFacts = () => {
    return facts.map(fact => (
      <div className="fact-container" key={fact._id}>
        <p>{fact.text}</p>
      </div>
    ));
  };

  return (
    <div className="container">
      <SkeletonPlaceholder
        loading={loading}
        count={5}
        id={'cat-facts-skeleton'}
      >
        {renderFacts()}
      </SkeletonPlaceholder>
    </div>
  );
}

export default App;
