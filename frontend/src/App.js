import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QuestionnaireList from './components/QuestionnaireList/QuestionnaireList';
import QuestionnaireForm from './components/QuestionnaireForm/QuestionnaireForm';
import TakeQuestionnaire from './components/TakeQuestionnaire/TakeQuestionnaire';
import EditQuestionnaire from './components/EditQuestionnaire/EditQuestionnaire';
import './App.scss';
import ResponseList from './components/ResponseList/ResponseList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleQuestionnaireAdded = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <Router>
      <nav>
        <Link
          to='/'
          className='main-page'
        >
          🏠 Головна
        </Link>{' '}
        |{' '}
        <Link
          to='/responses'
          className='main-page'
        >
          📄 Відповіді
        </Link>
      </nav>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <QuestionnaireForm
                onQuestionnaireAdded={handleQuestionnaireAdded}
              />
              <QuestionnaireList
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </>
          }
        />
        <Route
          path='/take/:id'
          element={<TakeQuestionnaire />}
        />
        <Route
          path='/edit/:id'
          element={<EditQuestionnaire />}
        />

        <Route
          path='/responses'
          element={<ResponseList />}
        />
      </Routes>
    </Router>
  );
}

export default App;
