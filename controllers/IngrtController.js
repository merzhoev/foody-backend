import IngredientModel from "../models/Ingredient.js";

export const getAutocomplete = async (req, res) => {
  try {
    let { query, limit } = req.query;
    query = query;
    limit = limit || 10;

    let ingrsList = [];

    if (query) {
      const regex = new RegExp(`(\\s+${query}|^${query})`, 'i');
      ingrsList = await IngredientModel.find({ name: regex }).limit(limit);
    }

    res.json(ingrsList);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить ингредиенты'
    });
  }
}