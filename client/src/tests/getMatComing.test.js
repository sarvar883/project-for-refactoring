import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import '@testing-library/jest-dom/extend-expect';


test('user month materialComing is getting correct data', () => {
  // возьмем например текущий месяц
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const requestObject = {
    type: 'month',
    userId: '5de3592cfd9b04001663c9d1',
    month: thisMonth,
    year: thisYear,
  };

  // отправить запрос мок-серверу
  return axios.post(`${URL}/stats/get-user-mat-coming`, { object: requestObject })
    .then(addMaterials => {
      addMaterials.forEach(object => {
        // объект не должен быть null
        expect(object).not.toBeNull();
        // дата объекта должна соответствовать месяцу
        expect(new Date(object.createdAt).getMonth()).toBe(thisMonth);
        expect(new Date(object.createdAt).getFullYear()).toBe(thisYear);
      });
    });
});