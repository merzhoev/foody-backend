import { body } from 'express-validator';

export const authValidation = [
  body('username', 'Имя пользователя должно содержать минимум 2 символа').isLength({ min: 2 }),
  body('password', 'Пароль должен содержать минимум 8 символа').isLength({ min: 8 }),
];