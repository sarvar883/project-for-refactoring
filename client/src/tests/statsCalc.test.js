import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import store from '../store';

import ShowAdminStats from '../components/admin/ShowAdminStats';
import calcStats from '../utils/calcStats';
import orders from './orders';


// проверка правильности total (сколько заказов принято)
test('correctly calculates statistics -> total', () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowAdminStats orders={orders} />
      </Router>
    </Provider>
  );

  // находим в классе элемент, который содержит информацию total
  const totalOrdersElement = document.querySelector('.total');
  // этот элемент должен отображаться на экране
  expect(totalOrdersElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(totalOrdersElement).not.toBeEmptyDOMElement();

  // находим число total внутри элемента
  const totalInComponent = Number(totalOrdersElement.innerHTML.split(':')[1]);
  // total должен быть равен длине массива заказов
  expect(totalInComponent).toBe(orders.length);
});

// проверка правильности completed (сколько выполнено)
test('correctly calculates statistics -> completed', () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowAdminStats orders={orders} />
      </Router>
    </Provider>
  );
  // находим в классе элемент, который содержит информацию completed
  const completedElement = document.querySelector('.completed');
  // этот элемент должен отображаться на экране
  expect(completedElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(completedElement).not.toBeEmptyDOMElement();

  // вычисляем статистику в специально созданном для этого методе "calcStats"
  // результат записываем в объект statsObject
  const statsObject = calcStats(orders) || {};

  // находим число completed внутри элемента
  const totalInComponent = Number(completedElement.innerHTML.split(':')[1]);
  //проверяем правильно ли он вычислен 
  expect(totalInComponent).toBe(statsObject.completed);
});

// проверка правильности confirmed (сколько заказов выполнено успешно)
test('correctly calculates statistics -> confirmed', () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowAdminStats orders={orders} />
      </Router>
    </Provider>
  );
  // находим в классе элемент, который содержит информацию confirmed
  const confirmedElement = document.querySelector('.confirmed');
  // этот элемент должен отображаться на экране
  expect(confirmedElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(confirmedElement).not.toBeEmptyDOMElement();

  // вычисляем статистику в специально созданном для этого методе "calcStats"
  // результат записываем в объект statsObject
  const statsObject = calcStats(orders) || {};

  // находим число confirmed внутри элемента
  const totalInComponent = Number(confirmedElement.innerHTML.split(':')[1]);
  //проверяем правильно ли он вычислен 
  expect(totalInComponent).toBe(statsObject.confirmedOrders.length);
});

// проверка правильности totalSum (общая сумма заказов)
test('correctly calculates statistics -> totalSum', () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowAdminStats orders={orders} />
      </Router>
    </Provider>
  );
  // находим в классе элемент, который содержит информацию totalSum
  const totalSumElement = document.querySelector('.totalSum');
  // этот элемент должен отображаться на экране
  expect(totalSumElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(totalSumElement).not.toBeEmptyDOMElement();

  // вычисляем статистику в специально созданном для этого методе "calcStats"
  // результат записываем в объект statsObject
  const statsObject = calcStats(orders) || {};

  // находим число totalSum внутри элемента
  const totalInComponent = Number(totalSumElement.innerHTML.split(':')[1]);
  //проверяем правильно ли он вычислен 
  expect(totalInComponent).toBe(statsObject.totalSum);
});

// проверка правильности totalScore (средний рейтинг заказов)
test('correctly calculates statistics -> totalScore', () => {
  render(
    <Provider store={store}>
      <Router>
        <ShowAdminStats orders={orders} />
      </Router>
    </Provider>
  );
  // находим в классе элемент, который содержит информацию totalScore
  const totalScoreElement = document.querySelector('.totalScore');
  // этот элемент должен отображаться на экране
  expect(totalScoreElement).toBeInTheDocument();
  // он не должен быть пустым
  expect(totalScoreElement).not.toBeEmptyDOMElement();

  // вычисляем статистику в специально созданном для этого методе "calcStats"
  // результат записываем в объект statsObject
  const statsObject = calcStats(orders) || {};

  // находим число totalScore внутри элемента
  const totalInComponent = Number(totalScoreElement.innerHTML.split(':')[1]);
  //проверяем правильно ли он вычислен 
  expect(totalInComponent).toBeCloseTo(statsObject.totalScore / statsObject.confirmedOrders.length);
});