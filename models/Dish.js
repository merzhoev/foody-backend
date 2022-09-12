import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema(
  {
    imageUrl: String,
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: []
    },
    ingredients: {
      type: [{
        name: String,
        amount: String
      }],
      validate: v => Array.isArray(v) && v.length > 0,
    },
    steps: {
      type: [String],
      validate: v => Array.isArray(v) && v.length > 0,
    },
    readyInMinutes: Number,
    servings: Number,
  }
);

export default mongoose.model('Dish', DishSchema);