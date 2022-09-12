import UserModel from '../models/User.js';
import DishModel from '../models/Dish.js';

export const getAll = async (req, res) => {
  try {
    const userId = req.userId;

    const { favorites } = await UserModel.findOne({ _id: userId }, 'favorites').populate('favorites');

    res.json(favorites);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить избранное'
    });
  }
};

export const create = async (req, res) => {
  try {
    const userId = req.userId;
    const dishId = req.params.id;

    const [, dish] = await Promise.all([
      UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { favorites: dishId } }
      ),
      DishModel.findOne({ _id: dishId })
    ]);

    res.json(dish);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось добавить в избранное'
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.userId;
    const dishId = req.params.id;

    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { favorites: dishId } }
    );

    res.json({
      success: true
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось удалить избранное'
    });
  }
};