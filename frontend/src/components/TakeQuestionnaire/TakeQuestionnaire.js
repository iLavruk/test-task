import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './TakeQuestionnaire.scss';

const TakeQuestionnaire = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/questionnaires/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestionnaire(data);
        setAnswers(data.questions.map(() => '')); // Створюємо об'єкт з пустими відповідями
      })
      .catch((error) => console.error('Помилка:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionnaire_id: id, answers }),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Опитування завершено!');
        navigate('/'); // Повертаємося на головну
      })
      .catch((error) => console.error('Помилка:', error));
  };

  const updateAnswer = (index, value) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((a, i) => (i === index ? value : a))
    );
  };

  if (!questionnaire) return <p>Завантаження...</p>;

  return (
    <div className="take-questionnaire">
      <h1 className="questionnaire-title">{questionnaire.name}</h1>
      <p className="questionnaire-description">{questionnaire.description}</p>
      <form className="questionnaire-form" onSubmit={handleSubmit}>
        {questionnaire.questions.map((q, index) => (
          <div className="questionnaire-question" key={index}>
            <p className="question-text">{q}</p>
            <input
              className="question-input"
              type="text"
              value={answers[index]}
              onChange={(e) => updateAnswer(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button className="submit-button" type="submit">
          ✅ Завершити опитування
        </button>
      </form>
    </div>
  );
};

export default TakeQuestionnaire;
