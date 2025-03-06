import { WaterCollection } from '../db/models/water.js';
import createError from 'http-errors';

export const addWater = async (userId, volume, date) => {
  if (volume < 50 || volume > 5000) {
    throw createError(400, 'The volume of water should be from 50 to 5000 ml');
  }

  const formattedDate = new Date(date);

  // створює юзер запис в базі і база повертає його тут

  const newWater = await WaterCollection.create({
    volume,
    date: formattedDate,
    userId,
  });
  return newWater;
};

export const updateWater = async (userId, id, volume, date) => {
  if (volume < 50 || volume > 5000) {
    throw createError(400, 'The volume of water should be from 50 to 5000 ml');
  }

  // редагує, в базі знаходиться id, відправлються нові данні та повертається оновлений запис

  const updatedWater = await WaterCollection.findOneAndUpdate(
    { _id: id, userId },
    { volume, date: new Date(date) },
    { new: true },
  );

  if (!updatedWater) {
    throw createError(404, 'No record found');
  }

  return updatedWater;
};

export const deleteWater = async (userId, id) => {
  const deletedWater = await WaterCollection.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deletedWater) {
    throw createError(404, 'No record found');
  }

  return;
};

export const getDailyWater = async (userId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // поч дня
  const end = new Date(start);
  end.setDate(end.getDate() + 1); // кін дня

  // знаходимо значення в базі за вказаний день

  const waterEntries = await WaterCollection.find({
    userId,

    //   фільтрація по даті

    date: { $gte: start, $lt: end },

    // тут фільтрація за датою в зворотньому напрямку
  })
    .sort({ date: -1 })
    .lean(); //отримуємо прості об'єкти

  return waterEntries.map((entry) => ({
    ...entry,
    date: new Date(entry.date), //  в Date
  }));
};

export const getMonthlyWater = async (userId, month) => {
  const start = new Date(month);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const waterEntries = await WaterCollection.find({
    userId,
    date: { $gte: start, $lt: end },
  })
    .sort({ date: -1 })
    .lean();

  return waterEntries.map((entry) => ({
    ...entry,
    date: new Date(entry.date), //  в Date
  }));
};
