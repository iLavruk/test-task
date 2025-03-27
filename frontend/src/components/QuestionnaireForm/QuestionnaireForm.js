import React, { useState } from 'react';
import { API_URL } from '../../config';
import './QuestionnaireForm.scss';

const QuestionnaireForm = ({ onQuestionnaireAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['']);

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const updateQuestion = (index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? value : q))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const questionnaire = { name, description, questions };

    fetch(`${API_URL}/api/questionnaires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionnaire),
    })
      .then((response) => response.json())
      .then(() => {
        setName('');
        setDescription('');
        setQuestions(['']);
        onQuestionnaireAdded(); // Викликаємо функцію для оновлення списку
      })
      .catch((error) => console.error('Помилка:', error));
  };

return (
    <div className="questionnaire-form">
        <h2 className="form-title">Створити нове опитування</h2>
        <form onSubmit={handleSubmit} className="form-container">
            <input
                type="text"
                placeholder="Назва"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="text"
                placeholder="Опис"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-input"
            />
            <h4 className="questions-title">Питання:</h4>
            {questions.map((q, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Питання ${index + 1}`}
                    value={q}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    required
                    className="question-input"
                />
            ))}
            <button
                type="button"
                onClick={addQuestion}
                className="add-question-button"
            >
                Додати питання
            </button>
            <button type="submit" className="submit-button">
                Зберегти опитування
            </button>
        </form>
    </div>
);
};

export default QuestionnaireForm;
