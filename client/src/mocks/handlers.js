import { rest } from 'msw';

const URL = 'http://localhost:5000';


export const handlers = [
  // путь, который возвращает запросы за конкретный месяц
  rest.post(`${URL}/stats/for-admin-month`, async (req, res, ctx) => {
    // конкретный месяц и год
    const month = Number(req.body.month);
    const year = Number(req.body.year);

    // читаем данные из файла json (в реальном проекте здесь будет запрос в БД)
    const response = await fetch('./orders.json');
    // расшифровываем json-формат
    const allOrders = await response.json();

    // фильтрация заказов по времени (оставляет только заказы, 
    // которые принадлежит этому месяцу)
    const filteredOrders = allOrders.filter(order =>
      new Date(order.dateFrom).getMonth() === month &&
      new Date(order.dateFrom).getFullYear() === year
    );

    // отправляет ответ на запрос
    return res(
      ctx.json(filteredOrders)
    );
  }),

  // путь, который возвращает запросы за конкретный день
  rest.post(`${URL}/stats/for-admin-day`, async (req, res, ctx) => {
    const day = req.body.day;

    // читаем данные из файла json (в реальном проекте здесь будет запрос в БД)
    const response = await fetch('./orders.json');
    const allOrders = await response.json();

    // фильтрация заказов по времени
    const filteredOrders = allOrders.filter(order =>
      new Date(order.dateFrom).setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0)
    );

    return res(
      ctx.json(filteredOrders)
    );
  }),

  // симулируем запрос и вызов метода getUserMatComing
  rest.post(`${URL}/stats/get-user-mat-coming`, async (req, res, ctx) => {
    const { type } = req.body.object;
    const month = Number(req.body.object.month);
    const year = Number(req.body.object.year);

    // читаем данные из файла json (в реальном проекте здесь будет запрос в БД)
    const response = await fetch('./addmaterials.json');
    const addMaterialsArray = await response.json();

    // фильтрация заказов по времени
    let filteredObjects = [];

    if (type === 'month') {
      filteredObjects = addMaterialsArray.filter(item =>
        new Date(item.createdAt).getMonth() === month &&
        new Date(item.createdAt).getFullYear() === year
      );
    } else if (type === 'week') {
      filteredObjects = objects.filter(item =>
        new Date(item.createdAt) >= new Date(req.body.object.days[0]) &&
        new Date(item.createdAt).setHours(0, 0, 0, 0) <= new Date(req.body.object.days[6])
      );
    }

    return res(
      ctx.json(filteredObjects)
    );
  }),
];