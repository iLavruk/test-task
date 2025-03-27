import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './EditQuestionnaire.scss';

const EditQuestionnaire = () => {
  const { id } = useParams(); // Отримуємо ID опитування з URL
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  // Завантажуємо дані опитування
  useEffect(() => {
    fetch(`${API_URL}/api/questionnaires/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setQuestions(data.questions);
      })
      .catch((error) => console.error('Помилка:', error));
  }, [id]);

  const updateQuestion = (index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? value : q))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedQuestionnaire = { name, description, questions };

    fetch(`${API_URL}/api/questionnaires/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuestionnaire),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Опитування оновлено!');
        navigate('/'); // Повертаємось на головну сторінку
      })
      .catch((error) => console.error('Помилка:', error));
  };

return (
    <div className="edit-questionnaire">
        <h2 className="edit-questionnaire__title">Редагувати опитування</h2>
        <form className="edit-questionnaire__form" onSubmit={handleSubmit}>
            <input
                className="edit-questionnaire__input"
                type="text"
                placeholder="Назва"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                className="edit-questionnaire__input"
                type="text"
                placeholder="Опис"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <h4 className="edit-questionnaire__questions-title">Питання:</h4>
            {questions.map((q, index) => (
                <input
                    key={index}
                    className="edit-questionnaire__question-input"
                    type="text"
                    placeholder={`Питання ${index + 1}`}
                    value={q}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    required
                />
            ))}
            <button className="edit-questionnaire__submit-button" type="submit">
                💾 Зберегти зміни
            </button>
        </form>
    </div>
);
};

export default EditQuestionnaire;
