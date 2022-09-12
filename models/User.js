import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    favorites: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
      }],
      default: []
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', UserSchema);