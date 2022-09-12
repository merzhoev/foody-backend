import DishModel from "../models/Dish.js";

const pantryIngrts = [
  'Вода',
  'вода',
  'Соль',
  'Сахар',
  'Сироп сахарный',
  'Сода',
  'Мука',
  'Молотый черный перец',
  'Масло подсолнечное',
  'Растительное масло',
  'Масло растительное',
  'Зелень',
  'Зелень укропа',
  'Укроп',
  'Укроп свежий',
  'Петрушка',
  'Приправа',
  'Специи',
  'Дрожжи',
  'Разрыхлитель теста',
  'Лист лавровый',
  'Уксус',
  'Лед',
  'Крошка хлебная',
  'Маринад',
];

export const getManyByIngrts = async (req, res) => {
  try {
    let { page, limit, ingredients, ignorePantry } = req.query;
    page = page || 1;
    limit = limit || 9;
    const offset = page * limit - limit;
    ignorePantry = JSON.parse(ignorePantry);

    if (ignorePantry) {
      ingredients += `,${pantryIngrts.join()}`;
    }
    ingredients = ingredients.split(',');

    const [dishes, dishCount] = await Promise.all([
      DishModel.find({
        '$expr': {
          '$setIsSubset': [
            '$ingredients.name',
            ingredients
          ]
        }
      }).skip(offset).limit(limit),
      DishModel.countDocuments({
        '$expr': {
          '$setIsSubset': [
            '$ingredients.name',
            ingredients
          ]
        }
      })
    ]);

    const totalPages = Math.ceil(dishCount / limit);

    res.json({
      dishes,
      totalPages
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить блюда'
    });
  }
};

export const getManyByTitle = async (req, res) => {
  try {
    let { page, limit, title } = req.query;
    page = page || 1;
    limit = limit || 9;
    const offset = page * limit - limit;

    const regex = new RegExp(`(\\s+${title}|^${title})`, 'i');
    const [dishes, dishCount] = await Promise.all([
      DishModel.find({ title: regex }).skip(offset).limit(limit),
      DishModel.countDocuments({ title: regex })
    ]);

    const totalPages = Math.ceil(dishCount / limit);

    res.json({
      dishes,
      totalPages
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить блюда'
    });
  }
}

export const getSimilarDishes = async (req, res) => {
  try {
    let { page, limit, categories, id } = req.query;
    page = page || 1;
    limit = limit || 3;
    const offset = page * limit - limit;

    const [dishes, dishCount] = await Promise.all([
      DishModel.find({ categories: { '$all': categories }, _id: { '$ne': id } }).skip(offset).limit(limit),
      DishModel.countDocuments({ categories: { '$all': categories }, _id: { '$ne': id } })
    ]);

    const totalPages = Math.ceil(dishCount / limit);

    res.json({
      dishes,
      totalPages
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить блюда'
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const dishId = req.params.id;

    DishModel.findById(
      { _id: dishId },
      (err, doc) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: 'Не удалось получить блюдо'
          });
        }

        if (!doc) {
          return res.status(500).json({
            message: 'Блюдо не найдено'
          });
        }

        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить блюдо'
    });
  }
};