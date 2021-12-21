import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// создаем мок-сервер
export const server = setupServer(...handlers);