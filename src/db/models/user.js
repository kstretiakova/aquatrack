//src/db/models/user.js
import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      default: '',
      maxlength: 12,
      validate: {
        validator: function (value) {
          // Если строка не пустая, она должна быть длиной минимум 2 символа
          return value === '' || value.length >= 2;
        },
        message: 'Name must be at least 2 characters long if provided',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'female',
    },
    weight: {
      type: Number,
      min: 0,
      max: 250,
      default: 0,
    },
    dailySportTime: {
      type: Number,
      min: 0,
      max: 24,
      default: 0,
    },
    dailyNorm: {
      type: Number,
      min: 500,
      max: 15000,
      default: 1500,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.methods.toJSON = function () {
  const {
    _id,
    name,
    email,
    gender,
    weight,
    dailySportTime,
    dailyNorm,
    avatarUrl,
  } = this.toObject();
  return {
    _id,
    name,
    email,
    gender,
    weight,
    dailySportTime,
    dailyNorm,
    avatarUrl,
  };
};

export const UsersCollection = model('users', usersSchema);
