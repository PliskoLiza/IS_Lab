import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';

  const MainPage = () => {
    const [answers, setAnswers] = useState(['', '', '']); // Состояние ответов, начальное значение для трех форм

    const handleInputChange = (index, value) => {
      const updatedAnswers = [...answers];
      updatedAnswers[index] = value;
      setAnswers(updatedAnswers);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Ответы:', answers);
      // Добавьте здесь логику отправки ответов на сервер или их обработки
    };

    const [formType, setFormType] = useState('');

    const handleSelectChange = (event) => {
      setFormType(event.target.value);
    };

    const renderForm = () => {
      switch (formType) {
        case 'form1':
          return (
              <form onSubmit={handleSubmit}>
                <h2>Форма 1</h2>
                <input
                    type="text"
                    value={answers[0]}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                />
              </form>
          );
        case 'form2':
          return (
              <form onSubmit={handleSubmit}>
                <h2>Форма 2</h2>
                <input
                    type="text"
                    value={answers[1]}
                    onChange={(e) => handleInputChange(1, e.target.value)}
                />
              </form>
          );
        case 'form3':
          return (
              <form onSubmit={handleSubmit}>
                <h2>Форма 3</h2>
                <input
                    type="text"
                    value={answers[2]}
                    onChange={(e) => handleInputChange(2, e.target.value)}
                />
              </form>
          );
        default:
          return null;
      }
    };

    return (
        <div>
          <h1>Выберите форму:</h1>
          <select value={formType} onChange={handleSelectChange}>
            <option value="">Выберите форму</option>
            <option value="form1">Форма 1</option>
            <option value="form2">Форма 2</option>
            <option value="form3">Форма 3</option>
          </select>
          {renderForm()}
        </div>
    );
  };
export default MainPage;