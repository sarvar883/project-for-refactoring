import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import store from '../store';

import ShowOrderQueries from '../components/operator/ShowOrderQueries';
import orders from './orders';


// проверяет наличие информации о дезинфекторе
test('Order details contain disinfector details', async () => {
  // виртуально рендерим этот класс
  render(
    <Provider store={store}>
      <Router>
        <ShowOrderQueries orders={orders} />
      </Router>
    </Provider>
  );

  // в классе найдем элемент, который содержит информацию об ответственном дезинфекторе
  const disinfectorTextElement = document.querySelector('.disinfector');
  // этот элемент должен отображаться на экране
  expect(disinfectorTextElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(disinfectorTextElement).not.toBeEmptyDOMElement();
  // он должен внутри себя содержать текст "Ответственный" и далее имя дезинфектора
  expect(disinfectorTextElement.innerHTML).toMatch(/Ответственный/i);
});


// проверяет наличие информации о клиенте
test('Order details contain client details', async () => {
  // виртуально рендерим этот класс
  render(
    <Provider store={store}>
      <Router>
        <ShowOrderQueries orders={orders} />
      </Router>
    </Provider>
  );

  // в классе найдем элемент, который содержит информацию о клиенте
  const clientElement = document.querySelector('.client');
  // этот элемент должен отображаться на экране
  expect(clientElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(clientElement).not.toBeEmptyDOMElement();
  // он должен внутри себя содержать текст "Клиент" и далее информация о клиенте
  expect(clientElement.innerHTML).toMatch(/Клиент/i);
});


// проверяет наличие информации о дате заказа
test('Order details contain date of order', async () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowOrderQueries orders={orders} />
      </Router>
    </Provider>
  );
  // в классе найдем элемент, который содержит информацию о дате
  const dateElement = document.querySelector('.date');
  // этот элемент должен отображаться на экране
  expect(dateElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(dateElement).not.toBeEmptyDOMElement();
  // он должен внутри себя содержать текст "Дата" и далее информация о дате
  expect(dateElement.innerHTML).toMatch(/Дата/i);
});


// проверяет наличие информации об адресе
test('Order details contain address', async () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowOrderQueries orders={orders} />
      </Router>
    </Provider>
  );
  // в классе ShowOrderQueries найдем элемент, который содержит информацию об адресе
  const addressElement = document.querySelector('.address');
  // этот элемент должен отображаться на экране
  expect(addressElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(addressElement).not.toBeEmptyDOMElement();
  // он должен внутри себя содержать текст "Адрес" и далее информация об адресе
  expect(addressElement.innerHTML).toMatch(/Адрес/i);
});


// проверяет наличие информации о типе сервиса
test('Order details contain typeOfService', async () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowOrderQueries orders={orders} />
      </Router>
    </Provider>
  );
  // в классе ShowOrderQueries найдем элемент, который содержит информацию о типе сервиса
  const serviceElement = document.querySelector('.typeOfService');
  // этот элемент должен отображаться на экране
  expect(serviceElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(serviceElement).not.toBeEmptyDOMElement();
  // он должен внутри себя содержать текст "услуги" и далее информация о типе сервиса
  expect(serviceElement.innerHTML).toMatch(/услуги/i);
});