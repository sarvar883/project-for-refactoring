import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import '@testing-library/jest-dom/extend-expect';

import axios from 'axios';
const URL = 'http://localhost:5000';


test('admin month stats is getting correct orders', () => {
  // возьмем например текущий месяц
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  // отправить запрос мок-серверу
  return axios.post(`${URL}/stats/for-admin-month`, { month: thisMonth, year: thisYear })
    .then(orders => {
      orders.forEach(order => {
        // заказ не должен быть null
        expect(order).not.toBeNull();
        // дата заказа должна соответствовать месяцу
        expect(new Date(order.dateFrom).getMonth()).toBe(thisMonth);
        expect(new Date(order.dateFrom).getFullYear()).toBe(thisYear);
      });
    });
});


test('admin day stats is getting correct orders', () => {
  // возьмем например 11 октября
  const string = '11-10-2021';
  const day = new Date(string);

  // отправить запрос мок-серверу
  return axios.post(`${URL}/stats/for-admin-month`, { day })
    .then(orders => {
      orders.forEach(order => {
        // заказ не должен быть null
        expect(order).not.toBeNull();
        // дата заказа должна соответствовать месяцу
        expect(new Date(order.dateFrom).setHours(0, 0, 0, 0).getMonth()).toEqual(new Date(day).setHours(0, 0, 0, 0));
      });
    });
});