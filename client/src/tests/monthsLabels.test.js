import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import store from '../store';

import AccStats from '../components/accountant/AccStats';


test('correct labels in month input', () => {
  // будем тестировать класс AccStats, поэтому 
  // виртуально его рендерим
  render(
    <Provider store={store}>
      <Router>
        <AccStats />
      </Router>
    </Provider>
  );

  // найдем в классе AccStats элемент для выбора месяца
  const monthInput = screen.queryByTestId('month-input');
  // элемент должен быть на экране
  expect(monthInput).toBeInTheDocument();
  // и он не должен быть пустым (то есть иметь children элементы)
  expect(monthInput).not.toBeEmptyDOMElement();

  // элементы выбора
  const monthOptions = screen.queryAllByTestId('month-options');
  // должно быть 13 выборов: 12 месяцев и 1 placeholder элемент
  expect(monthOptions).toHaveLength(13);

  // массив месяцев
  const monthsNames = ['Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь',
    'Ноябрь', 'Декабрь'];

  // все месяцы должны быть в options
  for (let i = 1; i < 13; i++) {
    let monthText = monthOptions[i].textContent;
    expect(monthText).toBe(monthsNames[i - 1]);
  }
});
