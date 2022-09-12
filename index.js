import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import DishModel from './models/Dish.js';

import { IngrtController, DishController, UserController, FavoriteController } from './controllers/index.js';
import { authValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './middlewares/index.js';

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://arbi:arbi2001@cluster0.y79g9tu.mongodb.net/foody?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  try {
    const regex = new RegExp(`(\\s+борщ|^борщ)`, 'i');
    const [dishes, dishCount] = await Promise.all([
      DishModel.find({ title: regex }).limit(5),
      DishModel.countDocuments({ title: regex })
    ]);

    res.json(dishes);
  } catch (err) {
    res.json({ message: 'some error occured' });
  }
});

app.get('/second', (req, res) => {
  res.json({ message: 'secondary route' });
});

app.post('/auth/login', authValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', authValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/favorites', checkAuth, FavoriteController.getAll);
app.post('/favorites/:id', checkAuth, FavoriteController.create);
app.delete('/favorites/:id', checkAuth, FavoriteController.remove);

app.get('/ingredients', IngrtController.getAutocomplete);

app.get('/dishes-similar', DishController.getSimilarDishes);
app.get('/dishes-by-ingrts', DishController.getManyByIngrts);
app.get('/dishes-by-name', DishController.getManyByTitle);
app.get('/dishes/:id', DishController.getOne);

app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));