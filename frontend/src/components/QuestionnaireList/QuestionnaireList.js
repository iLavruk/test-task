import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionnaireList.scss';

const QuestionnaireList = ({ refresh, setRefresh }) => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestionnaires, setTotalQuestionnaires] = useState(0);
  const navigate = useNavigate();
  const limit = 5; // Кількість опитувань на сторінку

  // Завантажуємо список опитувань з урахуванням пагінації
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/questionnaires?page=${page}&limit=${limit}`
    )
      .then((response) => response.json())
      .then(({ data, total }) => {
        setQuestionnaires(Array.isArray(data) ? data : []);
        setTotalPages(Math.ceil(total / limit));
        setTotalQuestionnaires(total); // Update totalQuestionnaires
      })
      .catch((error) => console.error('Помилка:', error));
  }, [page, refresh, totalPages]);

  // Видалення опитування
  const deleteQuestionnaire = (id) => {
    fetch(`http://localhost:5000/api/questionnaires/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTotalQuestionnaires((prev) => prev - 1);
        setTotalPages((prev) => Math.max(1, Math.ceil((totalQuestionnaires - 1) / limit))); // Перераховуємо totalPages

        // Якщо це останнє опитування на сторінці - переходимо на попередню
        setPage((prev) =>
          questionnaires.length === 1 && prev > 1 ? prev - 1 : prev
        );
        setQuestionnaires((prev) => prev.filter((q) => q.id !== id)); // Оновлюємо список опитувань

        // Форсуємо оновлення списку
        setTimeout(() => setRefresh((prev) => !prev), 0);
      })
      .catch((error) => console.error('Помилка при видаленні:', error));
  };

  return (
    <div>
      <h1>Каталог опитувань</h1>
      <ul className='questionnaire-list'>
        {questionnaires.length === 0 ? (
          <p>Опитувань ще немає.</p>
        ) : (
          questionnaires.map((q) => (
            <li
              className='questionnaire-list__item'
              key={q.id}
            >
              <strong>{q.name}</strong> {q.description}
              <p className='questionnaire-list__item-title'>
                Запитань: {JSON.parse(q.questions).length} | Проходжень:{' '}
                {q.completions}
              </p>
              <div className='questionnaire-list__item-actions'>
                <button onClick={() => navigate(`/take/${q.id}`)}>▶</button>
                <button onClick={() => navigate(`/edit/${q.id}`)}>✏</button>
                <button
                  className='questionnaire-list__item-actions--delete'
                  onClick={() => deleteQuestionnaire(q.id)}
                >
                  🗑
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Показуємо пагінацію тільки якщо є більше `limit` опитувань */}
      {totalQuestionnaires > limit && (
        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            ⬅ Попередня
          </button>
          <span>
            {' '}
            Сторінка {page} із {totalPages}{' '}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            ➡ Наступна
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireList;
