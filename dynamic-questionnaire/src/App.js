import React, { useState, useEffect } from 'react';
import Questionnaire from './Questionnaire';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/questions.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sanction Exposure Process Flow</h1>
      </header>
      <div className="App-content">
        <Questionnaire data={data} />
      </div>
    </div>
  );
}

export default App;