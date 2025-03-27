import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config';

const ResponseList = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = () => {
    fetch(`${API_URL}/api/responses`)
      .then((response) => response.json())
      .then((data) => setResponses(data))
      .catch((error) => console.error('Помилка:', error));
  };

  const clearResponses = () => {
    fetch(`${API_URL}/api/responses`, { method: 'DELETE' })
      .then(() => {
        setResponses([]); // Очищаємо список локально
        alert('Всі відповіді видалено!');
      })
      .catch((error) => console.error('Помилка при очищенні:', error));
  };

  return (
    <div>
      <h1>Відповіді на опитування</h1>
      {responses.length === 0 ? (
        <p>Ще ніхто не проходив опитування.</p>
      ) : (
        <>
          <button
            onClick={clearResponses}
            style={{ marginBottom: '10px', background: 'red', color: 'white' }}
          >
            🗑 Очистити всі відповіді
          </button>
          {responses.map((response, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              <p>
                <strong>ID опитування:</strong> {response.questionnaire_id}
              </p>
              <p>
                <strong>Дата:</strong> {response.completion_time}
              </p>
              <h4>Відповіді:</h4>
              <ul>
                {Object.entries(response.answers).map(
                  ([question, answer], i) => (
                    <li key={i}>
                      <strong>{question}</strong>: {answer}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ResponseList;
